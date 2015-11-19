var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'somesecretstring',
				saveUninitialized: true,
				resave: true,
				store: new MongoStore({mongooseConnection: mongoose.connection,
										ttl: 14 * 24 * 60 * 60})}));
				
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
				
app.set('view engine', 'ejs');

var auth = express.Router();
require('./app/routes/auth.js')(auth, passport);
app.use('/auth', auth);
 
var secure = express.Router();
require('./app/routes/secure.js')(secure, passport);
app.use('/', secure);

app.listen(port);
console.log('Server running on port:' + port);