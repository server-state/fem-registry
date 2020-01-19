const express = require('express');
const router = express.Router();
const uuidv5 = require('uuid/v5');
const validator = require('validator').default;
const sendVerificationMail = require('../../../lib/email/verify-email');
const url = require('url');
const Publisher = require('../../../model/Publisher');

let verificationTokens = {};

router.get('/', (req, res) => {
    res.render('dev/profile/change-email');
});

router.post('/',
    /**
     * @param {express.Request & {user, get}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
    if (!validator.isEmail(req.body['email'])) {
        return res.render('dev/profile/change-email', {
                error: 'Not a valid email'
            }
        );
    } else if (await Publisher.isEmailUsed(req.body['email'])) {
        return res.render('dev/profile/change-email', {
                error: 'Email is already used.'
            }
        );
    } else {
        const uuid = uuidv5(req.get('host'), uuidv5.URL);
        const verificationURL = new url.URL(`./${uuid}/`, url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl
        }));

        verificationTokens[uuid] = async () => {
            req['user'].email = req.body.email;
            await req.user.save();
        };

        // Deactivate link after 10 minutes
        setTimeout(() => verificationTokens[uuid] = undefined, 1000 * 60 * 10);

        await sendVerificationMail(req.user, req.body.email, verificationURL.href);

        return res.render('message', {
            title: 'Please verify your new email',
            message: 'An email containing a confirmation link has been sent to your new email address. Please open it within 10 minutes to confirm your new email address. If no verification occurs in this time, your old email will be kept and you\'ll have to try again.',
            next: {
                label: 'Back to profile',
                url: '../'
            }
        });
    }
});

router.get('/:verificationUUID', async (req, res) => {
    // Save as variable to avoid racing conditions:
    const f = verificationTokens[req.params.verificationUUID];

    if (f) {
        await f();
        verificationTokens[req.params.verificationUUID] = undefined;
        res.render('message', {
            title: 'Success',
            message: 'Your new email address has been verified successfully.'
        });
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
