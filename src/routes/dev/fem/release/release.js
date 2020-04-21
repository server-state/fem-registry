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

            if (req['fem'].id === (await release.getFEM()).id) {
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
    return res.render('dev/fem/release/show', {
        fem: req['fem'],
        release: req['release'],
        publisher: await (await req['release'].getFEM()).getPublisher()
    });
});

module.exports = router;
