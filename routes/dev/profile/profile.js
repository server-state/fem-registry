const express = require('express');
const router = express.Router();
require('../../../model/Publisher');
router.get('/', (req, res) => {
    return res.render('dev/profile/show', req.user);
});

router.get('/change-password', (req, res) => {
    res.render('dev/profile/change-password');
});

router.post('/change-password', async (req, res) => {
    let error = [];

    if (!req.body['old'] || !await req.user.verifyPassword(req.body['old'])) {
        error.push('Old password isn\'t correct');
    }

    if (!(req.body['new1'] && req.body['new2']) || req.body['new1'] !== req.body['new2']) {
        error.push('Passwords don\'t match');
    }

    if (req.body['new1'].length < 4) {
        error.push('Password must be at least 5 characters long')
    }

    if (error.length) {
        return res.render('dev/profile/change-password', {error: error.join(', ')});
    } else {
        await req.user.setPassword(req.body['new1']);
        await req.user.save();
        return res.redirect('..');
    }
});

router.get('/edit', (req, res) => {
    return res.render('dev/profile/edit', {user: req.user});
});

router.post('/edit', async (req, res) => {
    if (!req.body['name'] || req.body.name.length < 3) {
        return res.render('dev/profile/edit', {user: req.user, error: 'Username too short, must be >= 3 characters'});
    } else {
        req.user.name = req.body['name'];
        await req.user.save();
        return res.redirect('..');
    }
});

module.exports = router;
