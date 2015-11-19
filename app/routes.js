var User = require('./models/user');
module.exports = function(app, passport) {
	app.get('/', function(req,res) {
		res.render('index.ejs');
	});
	
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage')});
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));
	
	app.get('/signup', function(req,res) {
		res.render('signup.ejs', { message: req.flash('signupMessage')});
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));
	
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {user: req.user });
	});
	
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
	
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/connect/facebook', passport.authorize('facebook', {scope: 'emails'}));
	
	app.get('/connect/local', function(req,res) {
		res.render('connect-local.ejs', {message: req.flash('signupMessage')});
	});
	
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/connect/local',
		failureFlash: true
	}));
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	
	res.redirect('/login');
}