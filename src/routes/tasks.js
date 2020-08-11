const express = require('express');
const router = express.Router();
const xss = require('xss');
const tasks = require('../datalayer/tasks');
var ObjectID = require('mongodb').ObjectID;

router.get('/create', async (req, res) => {
	res.render(res.render('../src/views/board/add_task', { newTask: true }));
});

router.get('/:id/edit', async (req, res) => {
	console.log(ObjectID(req.params.id));
	try {
		const task_to_edit = await tasks.getTask(ObjectID(req.params.id));

		res.render(
			res.render('../src/views/board/add_task', {
				editTask: true,
				task_name: task_to_edit.taskName
			})
		);
	} catch (e) {
		res.status(404).json({ message: 'task not found' });
	}
});

router.get('/:id/comments', async (req, res) => {
	//TODO implement
});

router.get('/:id/comments/create', async (req, res) => {
	//TODO implement
});

router.post('/create', async (req, res) => {
	input = xss(req.body);

	//NOTE: for now, I'm sending jsons, but I will edit this later so it injects error into a handlebar file or something
	if (!input['taskName']) {
		res.status(400).json({ error: 'You must name the task' });
	}
	if (!req.session.user) {
		res.redirect('/login'); // this shouldn't be necessary, I will write a middleware for this
	}
	if (!input['status']) {
		res.status(400).json({ error: 'There must be a status' });
	}
	if (!input['tags']) {
		res.status(400).json({ error: 'There must be a tag' }); //are tags required?
	}
	//req.session.user should be firstName + LastName? Or all the user data?
	try {
		await tasks.addTask(
			input['taskName'],
			req.session.user,
			input['status'],
			input['tags']
		);
	} catch (e) {
		res.render('/create', {
			error: 'Uh oh, something went wrong, pleease try again'
		});
	}
});

router.patch('/:id/edit', async (req, res) => {
	//I think this is a patch, not a post
	//TODO:
	//Eleni
});

router.delete('/:id/remove', async (req, res) => {
	// I think this should be a delete, not a remove
	//TODO:
	//Eleni
});

router.post('/:id/drag', async (req, res) => {
	//I have no idea what to do here yet!
});

router.post('/:id/comments/create', async (req, res) => {
	input = xss(req.body);

	if (!input['comment']) {
		res.status(400).json({
			error: 'You must write a comment to submit a comment'
		});
	}

	try {
		await tasks.addComment(id, req.session.user, input['comment']);
	} catch (e) {
		res.render('/:id/comments/create', {
			error: 'Uh oh, something went wrong! Please try again'
		});
		//I know the page I'm rendering is wrong here, I will fix that
	}
});
module.exports = router;
