const express = require('express');
const router = express.Router();
const CBM = require('../model/CBM');
const Release = require('../model/Release');
const Image = require('../model/Image');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* GET users listing. */
router.get('/', function(req, res) {
    return res.json({status: 'ok'})
});

router.get('/image/:id', async (req, res) => {
    try {
        console.log(req.params.id, Image, Image.get);
        const i = await Image.get(Number.parseInt(req.params.id));
        res.contentType(i['mime_type']);
        res.send(i['data']) // Image data
    } catch (e) {
        res.sendStatus(404);
    }
});

/**
 * Returns cbm ids, optionally filtered by the search query with the `q` GET parameter, ordered by popularity
 */
router.get('/cbm', async (req, res) => {
    try {
        const query = req.query['q'] || ''; // /api/plugins?q=My+Plugin
        const page = req.query['p'] || 1; // /api/plugins?q=My+Plugin

        const result = await CBM.search(query, page);

        return res.json(result.map(value => value['cbm_id']));
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

router.get('/cbm/:id', async (req, res) => {
    try {
        const cbm = await CBM.get(1);
        const release = await cbm.getLatestApprovedRelease();
        const images = await release.getImages();
        const publisher = await cbm.getPublisher();
        return res.json({
            ...cbm,
            release,
            images,
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
            return res.sendStatus(400);
        }
    } catch (e) {
        return res.sendStatus(404);
    }
});

module.exports = router;
