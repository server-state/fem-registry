const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('dev/profile/change-password');
});

router.post('/',
    /**
     * @param {express.Request & {user}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
    let error = [];

    if (!req.body['old'] || !await req['user'].verifyPassword(req.body['old'])) {
        error.push('Old password isn\'t correct');
    }

    if (!(req.body['new1'] && req.body['new2']) || req.body['new1'] !== req.body['new2']) {
        error.push('Passwords don\'t match');
    }

    if (req.body['new1'].length < 4) {
        error.push('Password must be at least 5 characters long')
    }

    if (error.length) {
        res.render('dev/profile/change-password', {error: error.join(', ')});
    } else {
        await req['user'].setPassword(req.body['new1']);
        await req['user'].save();
        res.redirect('..');
    }
});

module.exports = router;
