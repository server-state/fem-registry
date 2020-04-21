const express = require('express');
const router = express.Router();
const model = require('../../../../model');

router.use('/new', require('./new'));

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
            /**
             * @type {*}
             */
            const release = await model.Release.findByPk(id);

            if (req['cbm'].id === (await release.getCBM()).id) {
                req.release = release;
                return next();
            } else {
                res.sendStatus(403);
            }
        } catch (e) {
            res.sendStatus(404);
        }
    });

router.get('/:release', async (req, res) => {
    return res.render('dev/cbm/release/show', {
        cbm: req['cbm'],
        release: req['release'],
        publisher: await (await req['release'].getCBM()).getPublisher()
    });
});

module.exports = router;
