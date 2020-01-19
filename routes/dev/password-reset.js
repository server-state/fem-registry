const express = require('express');
const router = express.Router();
const sendPasswordResetMail = require('../../lib/email/password-reset');
const url = require('url');
const uuidv5 = require('uuid/v5');

let verificationTokens = {};

router.get('/', (req, res) => {
    res.render('password-reset');
});

const Publisher = require('../../model/Publisher');
router.post('/', async (req, res) => {
    const users = await Publisher.get({email: req.body.email});

    if (users.length !== 1)
        return res.render('password-reset', {
            error: 'An account with this email address does not exist.'
        });

    const user = users[0];

    const uuid = uuidv5(req.get('host'), uuidv5.DNS);
    const resetURL = new url.URL(`./${uuid}/`, url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    }));

    verificationTokens[uuid] = user;

    // Deactivate link after 30 minutes
    setTimeout(() => verificationTokens[uuid] = undefined, 1000 * 60 * 30);

    await sendPasswordResetMail(user, resetURL.href);

    return res.render('message', {
        title: 'Check your email',
        message: 'A message with a link on which you can reset your password has been sent to your email address. Please open it within 30 minutes in order to reset your password.',
        next: {
            label: 'Back to login',
            url: '/dev/login/'
        }
    });
});

router.get('/:verificationUUID', async (req, res) => {
    // Save as variable to avoid racing conditions:
    const u = verificationTokens[req.params.verificationUUID];

    if (u) {
        return res.render('password-reset-new');
    } else {
        return req.sendStatus(404);
    }
});

router.post('/:verificationUUID', async (req, res) => {
    const u = verificationTokens[req.params.verificationUUID];

    if (u) {
        if (!(req.body['new1'] && req.body['new2'] && req.body['new1'] === req.body['new2']))
            return res.render('password-reset-new', {error: 'Both passwords have to be filled in and identical'});
        if (req.body['new1'].length < 5)
            return res.render('password-reset-new', {error: 'Password has to be at least 5 characters long'});

        await u.setPassword(req.body['new1']);
        await u.save();
        verificationTokens[req.params.verificationUUID] = undefined;
        
        return res.render('message', {
            title: 'Success',
            message: 'Your password has been updated.',
            next: {
                label: 'Login',
                url: '/dev/login/'
            }
        });
    } else {
        return req.sendStatus(404);
    }
});

module.exports = router;
