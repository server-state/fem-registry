const express = require('express');
const router = express.Router();
const Release = require('../../model/Release');
const releaseDetailRouter = require('./release-detail');

router.get('/new', (req, res) => {
    return res.render('dev/cbm/release/new', {
        error: null
    });
});

router.param('release', async (req, res, next, id) => {
    try {
        const release = await Release.get(Number.parseInt(id));

        if (req['cbm'].id === (await release.getCBM()).id) {
            req.release = release;
            return next();
        } else {
            return res.sendStatus(403);
        }
    } catch (e) {
        console.log('release not found');
        return res.sendStatus(404);
    }
});

router.use('/:release', releaseDetailRouter);

module.exports = router;
