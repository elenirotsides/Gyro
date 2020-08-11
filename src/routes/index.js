const loginRoutes = require('./login');
const boardRoutes = require('./board');
const registerRoutes = require('./register');
const tasksRoutes = require('./tasks');
//const session = require("express-session");

//I added session stuff in app.js, we can change this later if we want it here but I think
//it be best that we keep all middleware in app.js since that's where we configure stuff ~Eleni

const constructorMethod = (app) => {
	app.use('/login', loginRoutes);
	app.use('/board', boardRoutes);
	app.use('/register', registerRoutes);
	app.use('/tasks', tasksRoutes);
	/*
	app.get('/', (req, res) => {
		if (!req.session.user) {
			res.redirect('/login');
		} else {
			res.redirect('/board');
		}
	}); */

	app.get('/logout', async (req, res) => {
		req.session.destroy();
		//TODO:
		//Render logout successful notification
		//Redirct to login page

		return;
	});

	app.use('*', (req, res) => {
		res.redirect('/login');
	});
};

module.exports = constructorMethod;
