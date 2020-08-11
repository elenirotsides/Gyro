const express = require('express');
const router = express.Router();
const xss = require('xss');
const users = require('../datalayer/users');
const connection = require('../datalayer/mongoConnection');

router.get('/', async (req, res) => {
	res.render('../src/views/login/index', {
		title: 'Please signin'
	});
});

router.post('/', async (req, res) => {
	input = req.body;

	let user;

	try {
		user = await users.getUserByEmail(xss(input['email'].toLowerCase()));
	} catch (e) {
		return res.render('../src/views/login/index', {
			hasErrors: true,
			error:
				'Email or Password is incorrect. Please try logging in again.'
		});
	}

	if (xss(input['email'].toLowerCase()) === user.email) {
		let correctPassword = false;

		try {
			correctPassword = user.checkPassword(
				xss(input['password']),
				user.hashedPassword
			);
		} catch (e) {
			res.render('../src/views/login/index', {
				hasErrors: true,
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
				error:
					'Email or Password is incorrect. Please try logging in again.'
			});
		}
	}

	res.status(401).render('../src/views/login/index', {
		hasErrors: true,
		error: 'Email or Password is incorrect. Please try logging in again.'
	});

	const db = await connection();
	await db.serverConfig.close();
});

module.exports = router;
