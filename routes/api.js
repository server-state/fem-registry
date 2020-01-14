const express = require('express');
const router = express.Router();

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
    const CBM = require('../model/Cbm');
    try {
        const cbm = await CBM.get(1);
        const release = await cbm.getLatestApprovedRelease();
        const publisher = await cbm.getPublisher();
        return res.json({
            ...cbm,
            release,
            publisher: {name: publisher.name}
        });
    } catch (e) {
        console.warn(e);
        return res.sendStatus(404);
    }
});

router.get('/releases/:id', (req, res) => {

});

module.exports = router;
