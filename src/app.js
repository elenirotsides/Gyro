const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const xss = require('xss');

/* Apply XSS protection to every element of the req.body */
const xssProtectionMiddleware = (req, res, next) => {
	let keys = Object.keys(req.body);
	keys.forEach((key) => {
		// Uncomment to show each translation that occurs, per request
		// console.log(key + ': ' + req.body[key] + ' => ' + xss(req.body[key]));
		req.body[key] = xss(req.body[key]);
	});
	next();
};

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
	'handlebars',
	exphbs({ layoutsDir: 'src/views/layouts', defaultLayout: 'main' })
);
app.set('view engine', 'handlebars');

app.use(
	session({
		name: 'AuthCookie',
		secret: 'Not Gyro the food...Gyro the Jira knockoff',
		resave: false,
		saveUninitialized: true
	})
);

app.use(xssProtectionMiddleware);

//If a user is logged in, they should never see the login or register page
app.use('/login', (req, res, next) => {
	if (req.session.user) {
		return res.status(403).redirect('/board');
	} else {
		next();
	}
});
app.use('/register', (req, res, next) => {
	if (req.session.user) {
		return res.status(403).redirect('/board');
	} else {
		next();
	}
});
app.use('/board', (req, res, next) => {
	if (!req.session.user) {
		return res.status(403).redirect('/login');
	} else {
		next();
	}
});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});
