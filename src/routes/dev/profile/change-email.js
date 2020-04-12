const express = require('express');
const router = express.Router();
const validator = require('validator').default;
const sendVerificationMail = require('../../../lib/email/verify-email');
const url = require('url');

const model = require('../../../model');

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
    } else if (await model.Publisher.isEmailUsed(req.body['email'])) {
        return res.render('dev/profile/change-email', {
                error: 'Email is already used.'
            }
        );
    } else {
        const dbEntry = await model.PendingEmailConfirmations.create({
            PublisherId: req.user.id,
            email: req.body.email
        });

        const verificationURL = new url.URL(`./${dbEntry.id}/`, url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl
        }));


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
    const dbEntry = await model.PendingEmailConfirmations.findByPk(req.params.verificationUUID);

    if (dbEntry) {
        if (dbEntry.isExpired(10)) {
            await dbEntry.destroy();
            return res.sendStatus(404);
        } else {
            const publisher = await dbEntry.getPublisher();
            publisher.email = dbEntry.email;
            await publisher.save();
            await dbEntry.destroy();

            res.render('message', {
                title: 'Success',
                message: 'Your new email address has been verified successfully.'
            });
        }
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
