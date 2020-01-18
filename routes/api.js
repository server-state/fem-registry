const express = require('express');
const router = express.Router();
const CBM = require('../model/CBM');
const Release = require('../model/Release');
const Image = require('../model/Image');

/* GET users listing. */
router.get('/', function(req, res) {
    return res.json({status: 'ok'})
});

router.get('/image/:id', async (req, res) => {
    try {
        console.log(req.params.id, Image, Image.get);
        const i = await Image.get(Number.parseInt(req.params.id));
        res.contentType(i.mime_type);
        res.send(i.data) // Image data
    } catch (e) {
        res.sendStatus(404);
    }
});

/**
 * Returns cbm ids, optionally filtered by the search query with the `q` GET parameter, ordered by popularity
 */
router.get('/cbm', (req, res) => {
    const query = req.query['q']; // /api/plugins?q=My+Plugin

    return res.json([1,2,3])
});

router.get('/cbm/:id', async (req, res) => {
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

router.get('/releases/:id', async (req, res) => {
    try {
        const release = await Release.get(Number.parseInt(req.params.id));
        if (release.isApproved()) {
            return res.json(release);
        } else {
            return res.sendStatus(503);
        }
    } catch (e) {
        return res.sendStatus(404);
    }
});

module.exports = router;
