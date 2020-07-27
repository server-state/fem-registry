const express = require('express');
const router = express.Router();
const sendPasswordResetMail = require('../../lib/email/password-reset');
const url = require('url');
const getBaseURL = require('../../lib/baseURL');
const limiter = require('../../lib/rateLimiter')

const model = require('../../model');

router.get('/', (req, res) => {
    res.render('password-reset', {csrfToken: req.csrfToken()});
});

router.post('/', limiter, async (req, res) => {
    const publisher = await model.Publisher.findOne({where: {email: req.body.email}});

    if (!publisher)
        return res.render('password-reset', {
            error: 'An account with this email address does not exist.'
        });

    const resetHandler = await model.PendingPasswordReset.create({PublisherId: publisher.id});

    const resetURL = new url.URL(`${getBaseURL(req)}${req.originalUrl}${resetHandler.id}/`);

    // Deactivate link after 30 minutes
    await sendPasswordResetMail(publisher, resetURL.href);

    return res.render('message', {
        title: 'Check your email',
        message: 'A message with a link on which you can reset your password has been sent to your email address. Please open it within 30 minutes in order to reset your password.',
        next: {
            label: 'Back to login',
            url: '/dev/login/'
        }
    });
});

router.get('/:verificationUUID',
    /**
     * @param {import('express').Request} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
        // Save as variable to avoid racing conditions:
        const handler = await model.PendingPasswordReset.findByPk(req.params.verificationUUID);

        if (handler) {
            res.render('password-reset-new');
        } else {
            res.sendStatus(404);
        }
    });

router.post('/:verificationUUID', async (req, res) => {
    const handler = await model.PendingPasswordReset.findByPk(req.params.verificationUUID);

    if (handler) {
        if (Date.now() - 1000*60*10 > Date.parse(handler.createdAt)) {
            await handler.destroy();
            return res.sendStatus(410);
        }

        const publisher = await handler.getPublisher();

        if (!(req.body['new1'] && req.body['new2'] && req.body['new1'] === req.body['new2']))
            return res.render('password-reset-new', {error: 'Both passwords have to be filled in and identical'});
        if (req.body['new1'].length < 5)
            return res.render('password-reset-new', {error: 'Password has to be at least 5 characters long'});

        await publisher.setPassword(req.body['new1']);
        await handler.destroy();

        return res.render('message', {
            title: 'Success',
            message: 'Your password has been updated.',
            next: {
                label: 'Login',
                url: '/dev/login/'
            }
        });
    } else {
        return res.sendStatus(404);
    }
});

module.exports = router;
