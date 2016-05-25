var express = require('express');
var router = express.Router();

//Henter index siden, ved at have '/' som startpunkt (root)
router.get('/', function(req, res, next) {
	res.render('index', { title: "Flipper"});
});

module.exports = router;
