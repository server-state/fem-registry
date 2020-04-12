const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.render('dev/profile/show', {publisher: req['user']});
});

router.use('/change-password', require('./change-password'));
router.use('/change-email', require('./change-email'));
router.use('/edit', require('./edit'));

module.exports = router;
