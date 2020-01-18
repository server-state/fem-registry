const express = require('express');
const router = express.Router();
require('../../model/Release');
router.get('/', async (req, res) => {
    return res.render('dev/cbm/release/show', {...req.release});
});


module.exports = router;
