const express = require('express');
const router = express.Router();
const Release = require('../../../../model/Release');
const releaseDetailRouter = require('./release-detail');
const fileUploadMiddleware = require('express-fileupload');

router.get('/new', (req, res) => {
    return res.render('dev/cbm/release/new', {
        error: null
    });
});

router.use(fileUploadMiddleware({}));

router.post('/new',
    /**
     * 
     * @param {express.Request & {cbm, files}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
    try {
        const release = await Release.createRelease(req.cbm, req.files.code, req.files.images, req.body.release_notes);
        res.redirect(`../${release.id}/`);
    } catch (e) {
        res.render('dev/cbm/release/new', {error: e.message});
    }
});

router.param('release',
    /**
     * @param {express.Request & {release}} req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<void>}
     */
    async (req, res, next, id) => {
    try {
        const release = await Release.get(Number.parseInt(id));

        if (req['cbm'].id === (await release.getCBM()).id) {
            req.release = release;
            return next();
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        console.log('release not found');
        res.sendStatus(404);
    }
});

router.use('/:release', releaseDetailRouter);

module.exports = router;
