const express = require('express');
const router = express.Router();
const users = require('../datalayer/users');

router.get('/', async (req, res) => {
	res.render('../src/views/login/index', {
		title: 'Please signin',
		hideLogout: true
	});
});

router.post('/', async (req, res) => {
	input = req.body;

	let user;

	try {
		user = await users.getUserByEmail(input['email'].toLowerCase());
	} catch (e) {
		return res.render('../src/views/login/index', {
			hasErrors: true,
			hideLogout: true,
			error:
				'Email or Password is incorrect. Please try logging in again.'
		});
	}

	if (input['email'].toLowerCase() === user.email) {
		let correctPassword = false;

		try {
			correctPassword = user.checkPassword(
				input['password'],
				user.hashedPassword
			);
		} catch (e) {
			res.render('../src/views/login/index', {
				hasErrors: true,
				hideLogout: true,
				error:
					'Email or Password is incorrect. Please try logging in again.'
			});
		}

		if (correctPassword === true) {
			req.session.user = user;
			return res.redirect('/board');
		} else {
			return res.status(401).render('../src/views/login/index', {
				hasErrors: true,
				hideLogout: true,
				error:
					'Email or Password is incorrect. Please try logging in again.'
			});
		}
	}

	res.status(401).render('../src/views/login/index', {
		hasErrors: true,
		hideLogout: true,
		error: 'Email or Password is incorrect. Please try logging in again.'
	});
});

module.exports = router;
