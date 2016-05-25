var mongoose = require('mongoose');   
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	//Passport bliver her i stand til at kunne serialize og deserialize brugere således at man kan hente deres data når der logges ind.
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.log('deserializing user:',user.username);
			done(err, user);
		});
	});

//Passport har forskellige strategier til login og signup
	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			// Først tjekker den om de allerede eksisterer en bruger med det navn i databasen
			User.findOne({ 'username' :  username }, 
				function(err, user) {
					// Hvis der sker en fejl bruger den done metoden
					if (err)
						return done(err);
					// Hvis brugernavnet ikke eksisterer bliver man sendt tilbage til loginsiden
					if (!user){
						console.log('Brugernavn eksisterer ikke: '+username);
						return done(null, false);                 
					}
					// Bruger findes, men password er forkert 
					if (!isValidPassword(user, password)){
						console.log('Password er ikke gyldigt');
						return done(null, false); // sender person tilbage til loginsiden
					}
					// Bruger og password passer sammen, returnerer brugeren fra metoden, somherefter betragtes som success.
					return done(null, user);
				}
			);
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // request bliver sendt tilbage til callback hvis true.
		},
		function(req, username, password, done) {

			// finder bruger i db som har det indtastede brugernavn
			User.findOne({ 'username' :  username }, function(err, user) {
				// Hvis der sker en fejl bruger den done metoden
				if (err){
					console.log('Error in SignUp: '+err);
					return done(err);
				}
				// eksisterer allerede
				if (user) {
					console.log('Brugernavn eksisterer allerede: '+username);
					return done(null, false);
				} else {
					// opretter ny bruger hvis, navnet ikke er taget
					var newUser = new User();

					// definerer hvad der skal gemmes i db
					newUser.username = username;
					newUser.password = createHash(password);

					// gemmer ny bruger
					newUser.save(function(err) {
						if (err){
							console.log('Fejl ved oprettelse af ny bruger: '+err);  
							throw err;  
						}
						console.log(newUser.username + ' Ny bruger er oprettet');    
						return done(null, newUser);
					});
				}
			});
		})
	);
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Denne metode bruges til at generere Hash for oprettede passwords, disse bliver gemt i db
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
