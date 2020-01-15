const express = require('express');
const router = express.Router();
const CBM = require('../../model/CBM');
const Release = require('../../model/Release');

router.get('/', async (req, res) => {
    return res.render('dev/cbm/show', {cbm: req.cbm});
});

module.exports = router;
