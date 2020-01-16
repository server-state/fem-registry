const express = require('express');
const router = express.Router();
const CBM = require('../../model/CBM');
const Release = require('../../model/Release');

router.get('/', async (req, res) => {
    return res.render('dev/cbm/show', {cbm: req.cbm, releases: await req.cbm.getReleases(), latest: await req.cbm.getLatestApprovedRelease()});
});

module.exports = router;
