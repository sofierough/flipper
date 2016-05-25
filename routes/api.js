//alle routere starter med at inddrage express ved at bruge express router class
var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post'); //den model i db der bliver brugt


//Beskytter API'er med autentificering ved at bruge middleware
//Gør at alle kan se posts, men kun registrerede brugere kan update og create
function isAuthenticated (req, res, next) {

	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// hvis brugeren ikke er autentificeret bliver personen sendt tilbage til login siden.
	return res.redirect('/#login');
};

//Her registrerer man autenficerings middleware
router.use('/posts', isAuthenticated);




router.route('/posts')
	//Her laver man ny besked
	.post(function(req, res){

		var post = new Post();
		post.text = req.body.text;
		post.created_by = req.body.created_by;
		post.save(function(err, post) {
			if (err){
				return res.send(500, err);
			}
			return res.json(post);
		});
	})
	//her får man alle beskeder
	.get(function(req, res){
		console.log('debug1');
		Post.find(function(err, posts){
			console.log('debug2');
			if(err){
				return res.send(500, err);
			}
			return res.send(200,posts);
		});
	});

//hvis man gerne vil se en bestemt besked, (hvis man søger i url)
router.route('/posts/:id')
	//gets specified post
	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
			res.json(post);
		});
	}) 
	//Opdatere besked
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);

			post.created_by = req.body.created_by;
			post.text = req.body.text;

			post.save(function(err, post){
				if(err)
					res.send(err);

				res.json(post);
			});
		});
	})
	//Slette besked
	.delete(function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});

//routeren eksporteres som modul til app.js
module.exports = router;
