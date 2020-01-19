const express = require('express');
const router = express.Router();
const releaseRouter = require('./release/release');

router.get('/', async (req, res) => {
    return res.render('dev/cbm/show', {cbm: req['cbm'], releases: await req['cbm'].getReleases(), latest: await req['cbm'].getLatestApprovedRelease()});
});

router.use('/release', releaseRouter);

module.exports = router;
