const loginRoutes = require('./login');
const boardRoutes = require('./board');
const registerRoutes = require('./register');
const tasksRoutes = require('./tasks');

const blockIfNotLoggedIn = (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		res.status(403).redirect('/login');
	}
};

const blockIfLoggedIn = (req, res, next) => {
	if (req.session.user) {
		res.status(403).redirect('/');
	} else {
		next();
	}
};

const constructorMethod = (app) => {
	app.use('^/$', (req, res) => {
		if (req.session.user) {
			res.status(403).redirect('/board');
		} else {
			res.status(403).redirect('/login');
		}
	});
	app.use('/login', blockIfLoggedIn, loginRoutes);
	app.use('/register', blockIfLoggedIn, registerRoutes);

	app.use('/board', blockIfNotLoggedIn, boardRoutes);
	app.use('/tasks', blockIfNotLoggedIn, tasksRoutes);
	app.get('/logout', blockIfNotLoggedIn, async (req, res) => {
		req.session.destroy();
		res.status(200).redirect('/login');
	});

	app.use('*', (req, res) => {
		res.status(400).redirect('/');
	});
};

module.exports = constructorMethod;
