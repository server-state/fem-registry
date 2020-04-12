const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Server State Plugin Registry' });
});

router.get('/legal-notice', ((req, res) => {
  res.render('static/legal-notice');
}))

router.get('/privacy-policy', ((req, res) => {
  res.render('static/privacy-policy');
}))

module.exports = router;
