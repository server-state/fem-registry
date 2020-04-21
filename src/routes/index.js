const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Server State FEM Registry' });
});

router.get('/legal-notice', ((req, res) => {
  res.render('static/legal-notice');
}))

router.get('/privacy-policy', ((req, res) => {
  res.render('static/privacy-policy');
}))

router.use('/docs', require('./documentation'));

module.exports = router;
