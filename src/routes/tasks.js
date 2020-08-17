const express = require('express');
const router = express.Router();
const tasks = require('../datalayer/tasks');
const users = require('../datalayer/users');

router.get('/create', async (req, res) => {
	let all_users = await users.getAllUsers();

	res.render('../src/views/partials/task_form', {
		layout: null,
		newTask: true,
		users: all_users
	});
});

router.get('/:id/edit', async (req, res) => {
	try {
		const task = await tasks.getTask(req.params.id);
		const all_users = await users.getAllUsers();
		let comments = await Promise.all(
			task.comments.map(async (c) => {
				let author = await users.getUser(c.user);
				return {
					comment: c.comment,
					user: author.firstName + ' ' + author.lastName
				};
			})
		);
		task.comments = comments;

		res.status(200).render('../src/views/partials/task_form', {
			layout: null,
			newTask: false,
			users: all_users,
			task: task
		});
	} catch (e) {
		res.status(404).json({ message: `task ${req.params.id} not found` });
	}
});

router.get('/:id/view', async (req, res) => {
	try {
		const task = await tasks.getTask(req.params.id);
		let comments = await Promise.all(
			task.comments.map(async (c) => {
				let author = await users.getUser(c.user);
				return {
					comment: c.comment,
					user: author.firstName + ' ' + author.lastName
				};
			})
		);
		task.comments = comments;
		try {
			let user = await users.getUser(task.createdBy);
			task.createdBy = user.firstName + ' ' + user.lastName;
		} catch (e) {
			task.createdBy = 'Nobody';
		}

		try {
			let user = await users.getUser(task.assignedTo);
			task.assignedTo = user.firstName + ' ' + user.lastName;
		} catch (e) {
			task.assignedTo = 'Nobody';
		}

		try {
			switch (task.status) {
				case 0:
					task.status = 'Pending';
					break;
				case 1:
					task.status = 'In Progress';
					break;
				case 2:
					task.status = 'Review';
					break;
				case 3:
					task.status = 'Done';
					break;
			}
		} catch (e) {
			// this should never happen
			task.status = 'Pending';
		}

		res.status(200).render('../src/views/partials/task_view', {
			layout: null,
			task: task
		});
	} catch (e) {
		res.status(404).json({ message: `task ${req.params.id} not found` });
	}
});

router.post('/create', async (req, res) => {
	//this route is done
	//I just don't know how to fix the page its rendering when there's an error,
	//this is a known bug that needs to be resolved
	input = req.body;

	if (
		!input['taskName'].trim() ||
		!input['description'].trim() ||
		!input['tags'].trim()
	) {
		//don't know what page this should render here
		return res.status(400).render('../src/views/board/index', {
			title: 'Error',
			hasErrors: true,
			error: 'Input cannot be blank'
		});
	}

	tags = input['tags'].trim().split(',');

	try {
		await tasks.addTask(
			input['taskName'],
			input['description'],
			req.session.user._id,
			input['assigned_to'],
			0,
			tags
		);
	} catch (e) {
		return res.render('../src/views/board/index', {
			title: 'Error',
			hasErrors: true,
			error: 'Uh oh, something went wrong, please try again'
		});
	}
	res.redirect('/board');
});

router.post('/:id/edit', async (req, res) => {
	let id = req.params.id;
	let name = req.body['taskName'];
	let tags = req.body['tags'];
	let description = req.body['description'];
	let assigned_to = req.body['assigned_to'];

	await tasks.rawUpdateTask(id, {
		taskName: name,
		tags: tags.split(',').map((s) => s.trim()),
		description: description,
		assignedTo: assigned_to
	});

	res.redirect('/board');
});

router.post('/:id/delete', async (req, res) => {
	if (!req.params.id) {
		return res.render('../src/views/board/index', {
			title: 'Error',
			hasErrors: true,
			error: 'Uh oh, something went wrong, please try again'
		});
	}

	try {
		await tasks.deleteTask(req.params.id);
	} catch (e) {
		return res.status(404).render('../src/views/board/index', {
			title: 'Error',
			hasErrors: true,
			error: 'Uh oh, something went wrong, please try again'
		});
	}

	res.status(200).redirect('/');
});

router.post('/:id/drag', async (req, res) => {
	let id = req.params.id;
	let stage = req.body['stage'];

	if (!id || !stage) {
		return res.status(400).send();
	}

	try {
		await tasks.rawUpdateTask(id, { status: Number(stage) });
	} catch (e) {
		console.log(e);
		return res.status(400).send();
	}

	return res.status(200).send();
});

router.post('/:id/comments/create', async (req, res) => {
	let id = req.params.id;
	let comment = req.body['comment'].trim();

	if (!comment) {
		return res.status(400).render('../src/views/board/index', {
			title: 'Error',
			hasErrors: true,
			error: "Comment can't be blank!"
		});
	}

	try {
		await tasks.addComment(id, req.session.user._id, comment);
	} catch (e) {
		console.log(e);
		return res.render('..src/views/board/index', {
			title: 'Error',
			hasErrors: true,
			error: 'Uh oh, something went wrong! Please try again'
		});
	}

	return res.status(200).redirect('/');
});
module.exports = router;
