const express = require('express');
const router = express.Router();
const tasks = require('../datalayer/tasks');
const users = require('../datalayer/users');

router.get('/create', async (req, res) => {
	res.render('../src/views/board/task_form', { newTask: true });
});

router.get('/:id/edit', async (req, res) => {
	try {
		const task_to_edit = await tasks.getTask(req.params.id);
		const all_users = await users.getAllUsers();

		res.render('../src/views/board/task_form', {
			newTask: false,
			task_name: task_to_edit.taskName,
			tags: task_to_edit.tags,
			users: all_users
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
		res.status(400).render('../src/views/board/task_form', {
			error: 'You must name your task'
		});
	}
	if (!input['description']) {
		res.status(400).render('../src/views.board/task_form', {
			error: 'You must include a description'
		});
	}

	createdBy = req.session.user.firstName + ' ' + req.session.user.lastName;

	try {
		await tasks.addTask(
			input['taskName'],
			input['description'],
			createdBy,
			input['assignedTo'],
			status, //fix this
			tags //fix this
		);
	} catch (e) {
		res.render('/tasks/create', {
			error: 'Uh oh, something went wrong, please try again'
		});
	}
});

router.patch('/:id/edit', async (req, res) => {
	//I think this is a patch, not a post
	//TODO:
	//Eleni
});

router.delete('/:id/remove', async (req, res) => {
	// Waiting on Wes for db function
	//TODO:
	//Eleni
});

router.post('/:id/drag', async (req, res) => {
	//TODO:
	//Cassidy
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
