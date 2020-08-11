const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

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
		name: 'AuthCookie', //name the cookie, idk what to call it...
		secret: 'Not Gyro the food...Gyro the Jira knockoff',
		resave: false,
		saveUninitialized: true
	})
);

/*
middlware function for rerouting to the login page if user isn't logged in
*/
app.use(async (req, res, next) => {
	if (!req.session.user) {
		return res
			.status(403)
			.render('../src/views/login/index', { error: true });
	} else {
		next();
	}
});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});
