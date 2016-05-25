//alle routere starter med at inddrage express ved at bruge express router class
var express = require('express');
var router = express.Router();

module.exports = function(passport){

	//sender succes status på login request til angular
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	//sender failure status på login request til angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Brugernavn eller password er ikke gyldigt"});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//Fordi vi bruger passport function i routeren vil denne tage sig af at eksportere routeren og det skal derfor ikke defineres.
	return router;

}
