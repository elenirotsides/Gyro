const express = require('express');
const router = express.Router();
const users = require('../datalayer/users');
const connection = require('../datalayer/mongoConnection');

router.get('/', async (req, res) => {
	res.render('../src/views/login/register', { hideLogout: true });
});

router.post('/', async (req, res) => {
	input = req.body;

	//add user to users table
	//log user in
	//route to kanban board

	//error handling below, but I made the html fields required, so it may never even hit this point
	//thinking of checking for blank input, test that Eleni
	if (!input['firstName']) {
		return res.status(400).render('../src/views/login/register', {
			hasErrors: true,
			hideLogout: true,
			error: 'Uh oh! Something went wrong. Please try again.'
		});
	}
	if (!input['lastName']) {
		return res.status(400).render('../src/views/login/register', {
			hasErrors: true,
			hideLogout: true,
			error: 'Uh oh! Something went wrong. Please try again.'
		});
	}
	if (!input['email']) {
		return res.status(400).render('../src/views/login/register', {
			hasErrors: true,
			hideLogout: true,
			error: 'Uh oh! Something went wrong. Please try again.'
		});
	}
	if (!input['password']) {
		return res.status(400).render('../src/views/login/register', {
			hasErrors: true,
			hideLogout: true,
			error: 'Uh oh! Something went wrong. Please try again.'
		});
	}

	let addUser;
	//add logic here for not being able to add a user if the email already exists
	try {
		addUser = await users.addUser(
			input['firstName'],
			input['lastName'],
			input['email'].toLowerCase(),
			input['password']
		);
	} catch (e) {
		return res.status(400).render('../src/views/login/register', {
			hasErrors: true,
			hideLogout: true,
			error: 'Whoops! Something has gone wrong, please try again.'
		}); //fix this
	}

	let dbUserEmail = await users.getUserByEmail(addUser.email);
	if (dbUserEmail === input['email'].toLowerCase()) {
		//checking to make sure that the user was inserted into the db
	} else {
		return res.status(400).render('../src/views/login/register', {
			hasErrors: true,
			hideLogout: true,
			error: 'Error registering, please try again'
		});
	}
	//if addUser was successful, set req.session.user and route to /board
	//add a middleware to only show /login page to non-authenticated users
	res.redirect('/login'); //fix this

	const db = await connection();
	await db.serverConfig.close();
});

module.exports = router;
