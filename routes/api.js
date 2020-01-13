const express = require('express');
const router = express.Router();
const CBM = require('../model/CBM');

/* GET users listing. */
router.get('/', function(req, res) {
    return res.json({status: 'ok'})
});

router.get('/image/:id', (req, res) => {
    res.contentType('image/png');
    res.send('abc'); // Image data
});

/**
 * Returns cbm ids, optionally filtered by the search query with the `q` GET parameter, ordered by popularity
 */
router.get('/cbm', (req, res) => {
    const query = req.get('q'); // /api/plugins?q=My+Plugin

    return res.json([1,2,3])
});

router.get('/cbm/:id', async (req, res) => {

    const cbm = await CBM.get(1);
    cbm['publisher'] = await cbm.getPublisher();
    return res.json(cbm);
});

router.get('/releases/:id', (req, res) => {

});

module.exports = router;
