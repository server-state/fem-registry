const express = require('express');
const router = express.Router();
const validator = require('validator').default;
const sendVerificationMail = require('../../lib/email/verify-email');
const url = require('url');
const getBaseURL = require('../../lib/baseURL');
const model = require('../../model');

router.get('/', (req, res) => {
    res.render('sign-up');
});

router.post('/',
    /**
     * @param {express.Request & {user, get}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
        let error = [];
        if (!validator.isEmail(req.body['email'])) {
            error.push('Email is not valid')
        }
        if (await model.Publisher.isEmailUsed(req.body['email'])) {
            error.push('Email is already used');
        }

        if (!(req.body['p1'] && req.body['p2']) || req.body['p1'] !== req.body['p2']) {
            error.push('Passwords don\'t match');
        }

        if (req.body['p1'].length < 4) {
            error.push('Password must be at least 5 characters long')
        }

        if (!req.body['name'] || req.body['name'].length < 3) {
            error.push('Name must be at least 3 characters long')
        }

        if (error.length !== 0) {
            return res.render('sign-up', {
                    error: error.join(', ')
                }
            );
        } else {
            const publisher = new model.Publisher();
            publisher.name = req.body['name'];
            publisher.email = null;
            await publisher.setPassword(req.body['p1']);

            const verificationMailEntry = await model.PendingEmailConfirmations.create({
                PublisherId: publisher.id,
                email: req.body['email']
            });

            const verificationURL = new url.URL(`/dev/sign-up/${verificationMailEntry.id}/`, getBaseURL(req));

            await sendVerificationMail(publisher, req.body.email, verificationURL.href);
            return res.render('message', {
                title: 'Please verify your new email',
                message: 'An email containing a confirmation link has been sent to your new email address. Please open it within 30 minutes to confirm your email address. If no verification occurs in this time, you\'ll have to create your account again.',
            });
        }
    });


router.get('/:verificationUUID', async (req, res) => {
    // Save as variable to avoid racing conditions:
    const dbEntry = await model.PendingEmailConfirmations.findByPk(req.params.verificationUUID);

    if (dbEntry) {
        if (dbEntry.isExpired(30)) {
            await dbEntry.destroy();
            return res.sendStatus(404);
        }

        const publisher = await dbEntry.getPublisher();
        publisher.email = dbEntry.email;
        await publisher.save();
        await dbEntry.destroy();

        res.render('message', {
            title: 'Success',
            message: 'Your email address has been confirmed and your account created.',
            next: {
                label: 'Proceed to login',
                url: '/dev/login/'
            }
        });
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
