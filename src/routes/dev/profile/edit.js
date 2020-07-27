const express = require('express');
const router = express.Router();
const limiter = require('../../../lib/rateLimiter')

router.get('/', (req, res) => {
    return res.render('dev/profile/edit', {user: req['user']});
});

router.post('/', limiter,
    /**
     * @param {express.Request & {user}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
    if (!req.body['name'] || req.body.name.length < 3) {
        return res.render('dev/profile/edit', {user: req['user'], error: 'Username too short, must be >= 3 characters'});
    } else {
        req['user'].name = req.body['name'];
        await req['user'].save();
        return res.redirect('..');
    }
});

module.exports = router;
