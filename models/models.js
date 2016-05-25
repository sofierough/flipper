//Models - mongoose bruges til at lave skemaer der definerer user og post objekter 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	//refererer til User skema hvor den finder id'et for den person som skriver
	created_by: { type: Schema.ObjectId, ref: 'User' },
	created_at: {type: Date, default: Date.now},
	text: String
});

var userSchema = new mongoose.Schema({
	username: String,
	password: String, // Hash fra password
	created_at: {type: Date, default: Date.now}
})

// Her opretter vi skemaerne som modeller i mongoose, så de bliver oprettet i db
mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
