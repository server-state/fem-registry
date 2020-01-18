const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    return res.render('dev/cbm/release/show', {...req.release, publisher: await (await req.release.getCBM()).getPublisher()});
});

module.exports = router;