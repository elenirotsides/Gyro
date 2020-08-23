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
		req.body[key] = xss(req.body[key]);
	});
	next();
};

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
	'handlebars',
	exphbs({
		helpers: {
			ifeq: (arg1, arg2, options) => {
				return arg1 == arg2 ? options.fn(this) : options.inverse(this);
			}
		},
		layoutsDir: 'src/views/layouts',
		defaultLayout: 'main'
	})
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

configRoutes(app);

app.listen(3000, () => {
	// for vanity
	console.log(` _______  __   __  ______    _______ 
|       ||  | |  ||    _ |  |       |
|    ___||  |_|  ||   | ||  |   _   |
|   | __ |       ||   |_||_ |  | |  |
|   ||  ||_     _||    __  ||  |_|  |
|   |_| |  |   |  |   |  | ||       |
|_______|  |___|  |___|  |_||_______|v1.0
	(better than Jira)
    Go to http://localhost:3000`);
});
