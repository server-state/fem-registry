const express = require('express');
const router = express.Router();
const femDetailRouter = require('./fem-detail');
const model = require('../../../model');

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('..');
});

router.get('/new', async (req, res) => {
    return res.render('dev/fem/new');
});

router.post('/new',
    /**
     * @param {express.Request & {user}} req
     * @param res
     * @returns {Promise<void>}
     */
    async (req, res) => {
    if (!req.body['name'])
        return res.render('dev/fem/new', {
            error: 'Some required fields are empty!'
        });

    const fem = await model.FEM.create({
        name: req.body.name,
        PublisherId: req.user.id
    })

    return res.redirect(`/dev/fem/${fem.id}/`);
});

router.param('fem',
    /**
     * @param {express.Request & {user, fem}} req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<void>}
     */
    async (req, res, next, id) => {
    try {
        const fem = await model.FEM.findByPk(id);

        if (req['user'].id === (await fem.getPublisher()).id) {
            req.fem = fem;
            return next();
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        res.sendStatus(404);
    }
});

router.use('/:fem', femDetailRouter);

module.exports = router;
