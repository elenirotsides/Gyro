const loginRoutes = require('./login');
const boardRoutes = require('./board');
const registerRoutes = require('./register');
const tasksRoutes = require('./tasks');

const constructorMethod = (app) => {
	app.use('/login', loginRoutes);
	app.use('/board', boardRoutes);
	app.use('/register', registerRoutes);
	app.use('/tasks', tasksRoutes);

	app.get('/logout', async (req, res) => {
		req.session.destroy();
		res.redirect('/login');
	});

	app.use('*', (req, res) => {
		res.redirect('/login');
	});
};

module.exports = constructorMethod;
