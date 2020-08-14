const express = require('express');
const router = express.Router();
const users = require('../datalayer/users');

router.get('/', async (req, res) => {
	res.render('../src/views/login/register', {
		title: 'Register',
		hideLogout: true
	});
});

router.post('/', async (req, res) => {
	input = req.body;

	/* 
	I made all the fields required in the html using the 'required' keyword.
	The below error handling takes care of the case when a user inputs only spaces
	*/

	if (!input['firstName'].trim()) {
		return res
			.status(400)
			.render('../src/views/login/register', {
				title: 'Error',
				hideLogout: true,
				hasErrors: true,
				error: 'Uh oh! No blank inputs allowed, please try again.'
			});
	}
	if (!input['lastName'].trim()) {
		return res
			.status(400)
			.render('../src/views/login/register', {
				title: 'Error',
				hideLogout: true,
				hasErrors: true,
				error: 'Uh oh! No blank inputs allowed, please try again.'
			});
	}
	if (!input['email'].trim()) {
		return res
			.status(400)
			.render('../src/views/login/register', {
				title: 'Error',
				hideLogout: true,
				hasErrors: true,
				error: 'Uh oh! No blank inputs allowed, please try again.'
			});
	}
	if (!input['password'].trim()) {
		return res
			.status(400)
			.render('../src/views/login/register', {
				title: 'Error',
				hideLogout: true,
				hasErrors: true,
				error: 'Uh oh! No blank inputs allowed, please try again.'
			});
	}

	let emailExists;

	try {
		emailExists = await users.getUserByEmail(input['email'].toLowerCase());
	} catch {
		emailExists = false;
	}

	let addUser;

	if (emailExists === false) {
		try {
			addUser = await users.addUser(
				input['firstName'],
				input['lastName'],
				input['email'].toLowerCase(),
				input['password']
			);
		} catch (e) {
			res.status(400).render('../src/views/login/register', {
				title: 'Error',
				hideLogout: true,
				hasErrors: true,
				error: 'Whoops! Something has gone wrong, please try again.'
			});
		}
	} else {
		return res.status(400).render('../src/views/login/register', {
			title: 'Error',
			hideLogout: true,
			hasErrors: true,
			error:
				'Sorry, account already exists with that email. Please try registering again.'
		});
	}

	//if addUser was successful, req.session.user will be set and user will be redirected to /board
	req.session.user = addUser;
	res.redirect('/board');
});

module.exports = router;
