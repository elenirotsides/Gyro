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
			description: task_to_edit.description,
			users: all_users,
			comments: task_to_edit.comments
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
	//TODO
});

router.delete('/:id', async (req, res) => {
	//done, code is functioning but there are bugs associated when the delete
	//button is triggered
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
});

router.post('/:id/drag', async (req, res) => {
	//TODO:
	//Cassidy, I think?
});

router.post('/:id/comments/create', async (req, res) => {
	//this is not done yet, I'm actively working on it
	//I don't know if this works yet, when I try and add the comment, the site breaks
	//is it just not being triggered?
	//I also don't really know which pages should be rendered if there is an error
	input = req.body;

	if (!input['comment'].trim() || !input['comment']) {
		return res.status(400).render('../src/views/board/index', {
			title: 'Error',
			hasErrors: true,
			error: "Comment can't be blank!"
		});
	}

	try {
		await tasks.addComment(
			req.params.id,
			req.session.user,
			input['comment']
		);
	} catch (e) {
		res.render('..src/views/board/index', {
			title: 'Error',
			hasErrors: true,
			error: 'Uh oh, something went wrong! Please try again'
		});
	}
});
module.exports = router;
