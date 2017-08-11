var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TTU ACM' });
});

/* GET calendar page. */
router.get('/events', function(req, res, next) {
  res.render('events', { title: 'TTU ACM' });
});

/* GET team page. */
router.get('/team', function(req, res, next) {
  res.render('team', { title: 'TTU ACM' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'TTU ACM' });
});

//TODO: Login functionality
/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/users/detail', function(req, res, next) {
    res.send('detail');
});

module.exports = router;
