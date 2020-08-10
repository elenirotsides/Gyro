const express = require('express');
const router = express.Router();
const tasks = require('../datalayer/tasks');

router.get('/', async (req, res) => {
	let all_tasks = await tasks.getAllTasks();

	let pending_tasks = all_tasks.filter(function (e) {
		return e.status === 0;
	});
	let in_progress_tasks = all_tasks.filter(function (e) {
		return e.status === 1;
	});
	let review_tasks = all_tasks.filter(function (e) {
		return e.status === 2;
	});
	let done_tasks = all_tasks.filter(function (e) {
		return e.status === 3;
	});

	res.render('../src/views/board/index', {
		pending_tasks: pending_tasks,
		in_progress_tasks: in_progress_tasks,
		review_tasks: review_tasks,
		done_tasks: done_tasks
	});
});

module.exports = router;
