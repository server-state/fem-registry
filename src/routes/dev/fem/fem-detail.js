const express = require('express');
const router = express.Router();
const releaseRouter = require('./release/release');

router.get('/', async (req, res) => {
    return res.render('dev/fem/show', {
        fem: req['fem'],
        releases: await req['fem'].getReleases(),
        latest: await req['fem'].getLatestApprovedRelease()
    });
});

router.use('/release', releaseRouter);

module.exports = router;
