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
		throw e;
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
			console.log(JSON.stringify(e));
		}

		res.status(200).render('../src/views/partials/task_view', {
			layout: null,
			task: task
		});
	} catch (e) {
		res.status(404).json({ message: `task ${req.params.id} not found` });
		throw e;
	}
});

router.post('/create', async (req, res) => {
	input = req.body;

	if (!input['taskName'].trim() || !input['description'].trim()) {
		return res
			.status(400)
			.json({ message: `You must have a task name and description` });
	}

	tagsArray = input['tags'].trim().split(',');
	tagsArrayLowerCase = [];

	for (let i = 0; i < tagsArray.length; i++) {
		tagsArrayLowerCase.push(tagsArray[i].toLowerCase());
	}

	//filtering out duplicates
	let uniqueTags = [...new Set(tagsArrayLowerCase)];

	for (let i = 0; i < uniqueTags.length; i++) {
		if (uniqueTags[i].length > 23) {
			return res
				.status(400)
				.json({ message: `Tags must be less than 24 characters!` });
		}
	}

	try {
		await tasks.addTask(
			input['taskName'],
			input['description'],
			req.session.user._id,
			input['assigned_to'],
			0,
			uniqueTags
		);
	} catch (e) {
		res.status(400).send(e);
		throw e;
	}
	res.redirect('/board');
});

router.post('/:id/edit', async (req, res) => {
	let id = req.params.id;
	let name = req.body['taskName'];
	let tags = req.body['tags'];
	let description = req.body['description'];
	let assigned_to = req.body['assigned_to'];

	tagsArray = tags.trim().split(',');
	tagsArrayLowerCase = [];

	for (let i = 0; i < tagsArray.length; i++) {
		tagsArrayLowerCase.push(tagsArray[i].toLowerCase());
	}

	//filtering out duplicates
	let uniqueTags = [...new Set(tagsArrayLowerCase)];

	for (let i = 0; i < uniqueTags.length; i++) {
		if (uniqueTags[i].length > 25) {
			return res
				.status(400)
				.json({ message: `Tags must be less than 25 characters` });
		}
	}

	try {
		await tasks.updateTask(id, {
			taskName: name,
			tags: uniqueTags,
			description: description,
			assignedTo: assigned_to
		});
	} catch (e) {
		return res.status(400).json({ message: `${e}` });
	}

	return res.status(200).redirect('/');
});

router.post('/:id/delete', async (req, res) => {
	if (!req.params.id) {
		return res.status(400).json({ message: `ERROR: no task ID passed` });
	}

	try {
		await tasks.deleteTask(req.params.id);
	} catch (e) {
		res.status(404).send({});
		throw e;
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
		await tasks.updateTask(id, { status: Number(stage) });
	} catch (e) {
		res.status(400).send(e);
		throw e;
	}

	return res.status(200).send();
});

router.post('/:id/comments/create', async (req, res) => {
	let id = req.params.id;
	let comment = req.body['comment'].trim();

	if (!comment) {
		return res
			.status(400)
			.send('ERROR: you must provide a comment to create');
	}

	try {
		await tasks.addComment(id, String(req.session.user._id), comment);
	} catch (e) {
		res.status(400).send(e);
		throw e;
	}

	return res.status(200).redirect('/');
});
module.exports = router;
