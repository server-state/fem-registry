const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('..');
});

router.get('/new', async (req, res) => {
    return res.render('dev/cbm/new');
});

router.param('cbm', async (req, res, next, id) => {
    const CBM = require('../../model/CBM');
    try {
        const cbm = await CBM.get(Number.parseInt(id));

        if (req['user'].id === (await cbm.getPublisher()).id) {
            req.cbm = cbm;
            return next();
        } else {
            return res.sendStatus(403);
        }
    } catch (e) {
        return next(e);
    }
});

router.get('/:cbm', async (req, res) => {
    res.json(req['cbm']);
});

module.exports = router;
