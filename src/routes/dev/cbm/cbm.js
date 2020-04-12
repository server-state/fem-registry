const express = require('express');
const router = express.Router();
const cbmDetailRouter = require('./cbm-detail');
const model = require('../../../model');

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('..');
});

router.get('/new', async (req, res) => {
    return res.render('dev/cbm/new');
});

router.post('/new',
    /**
     * @param {express.Request & {user}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
    if (!req.body['name'])
        return res.render('dev/cbm/new', {
            error: 'Some required fields are empty!'
        });

    const cbm = await model.CBM.create({
        name: req.body.name,
        PublisherId: req.user.id
    })

    return res.redirect(`/dev/cbm/${cbm.id}/`);
});

router.param('cbm',
    /**
     * @param {express.Request & {user, cbm}} req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<void>}
     */
    async (req, res, next, id) => {
    try {
        const cbm = await model.CBM.findByPk(id);

        if (req['user'].id === (await cbm.getPublisher()).id) {
            req.cbm = cbm;
            return next();
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        res.sendStatus(404);
    }
});

router.use('/:cbm', cbmDetailRouter);

module.exports = router;
