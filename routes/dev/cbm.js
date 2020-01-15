const express = require('express');
const router = express.Router();
const cbmDetailRouter = require('./cbm-detail');
const CBM = require('../../model/CBM');

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('..');
});

router.get('/new', async (req, res) => {
    return res.render('dev/cbm/new');
});

router.post('/new', async (req, res) => {
    if (!req.body['name'] || !req.body['support_url'])
        return res.render('dev/cbm/new', {
            error: 'Some required fields are empty!'
        });

    const cbm = new CBM();
    cbm.name = req.body.name;
    cbm.support_url = req.body.support_url;
    cbm.publisher_id = req.user.id;
    cbm.website = req.body['website'] || null;
    cbm.repo_url = req.body['repo_url'] || null;

    await cbm.save();
    return res.redirect(`/dev/cbm/${cbm.id}`);
});

router.param('cbm', async (req, res, next, id) => {
    try {
        const cbm = await CBM.get(Number.parseInt(id));

        if (req['user'].id === (await cbm.getPublisher()).id) {
            req.cbm = cbm;
            return next();
        } else {
            return res.sendStatus(403);
        }
    } catch (e) {
        return res.sendStatus(404);
    }
});

router.use('/:cbm', cbmDetailRouter);

module.exports = router;
