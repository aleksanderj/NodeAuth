var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	}
});

userSchema.methods.validPassword = function(password){
	return true;
}

module.exports = mongoose.model('User', userSchema);