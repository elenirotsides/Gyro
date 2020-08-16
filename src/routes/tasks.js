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
		const task_to_edit = await tasks.getTask(req.params.id);
		const all_users = await users.getAllUsers();

		res.render('../src/views/partials/task_form', {
			layout: null,
			newTask: false,
			task_name: task_to_edit.taskName,
			tags: task_to_edit.tags,
			users: all_users,
			comments: task_to_edit.comments
		});
	} catch (e) {
		res.status(404).json({ message: `task ${req.params.id} not found` });
	}
});

router.get('/:id/comments', async (req, res) => {
	try {
		const task_to_view = await tasks.getTask(req.params.id);

		res.render('../src/views/board/task_comments', {
			comments: task_to_view.comments
		});
	} catch (e) {
		res.status(404).json({ message: `task ${req.params.id} not found` });
	}
});

router.post('/create', async (req, res) => {
	input = req.body;

	if (!input['taskName']) {
		res.status(400).render('../src/views/board/index', {
			error: 'You must name your task'
		});
	}
	if (!input['description']) {
		res.status(400).render('../src/views/board/index', {
			error: 'You must include a description'
		});
	} /*
	if (input['tags'].length < 1) {
		res.status(400).render('../src/views/board/index', {
			error: 'There must be at least one tag'
		});
	} */

	try {
		await tasks.addTask(
			input['taskName'],
			input['description'],
			req.session.user._id,
			input['assignedTo'],
			0,
			[input['tags']]
		);
	} catch (e) {
		res.render('../src/views/board/index', {
			error: 'Uh oh, something went wrong, please try again'
		});
	}
});

router.patch('/:id/edit', async (req, res) => {
	//TODO:
	//is this supposed to be patch? idk
	//Eleni
});

router.delete('/:id/remove', async (req, res) => {
	//TODO:
	//is this supposed to be delete? idk
	//Eleni
});

router.post('/:id/drag', async (req, res) => {
	//TODO:
	//Cassidy, I think?
});

router.post('/:id/comments/create', async (req, res) => {
	input = req.body;

	if (!input['comment']) {
		res.status(400).render('../src/views/board/', {
			error: 'You must write a comment to submit a comment'
		});
	}
	if (!input['comment'].trim()) {
		res.status(400).render('../src/views/board/', {
			hasErrors: true,
			error: "Comment can't be blank!"
		});
	}
	try {
		await tasks.addComment(id, req.session.user, input['comment']);
	} catch (e) {
		res.render('/:id/comments/create', {
			hasErrors: true,
			error: 'Uh oh, something went wrong! Please try again'
		});
		//I know the page I'm rendering is wrong here, I will fix that
	}
});
module.exports = router;
