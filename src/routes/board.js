const express = require('express');
const router = express.Router();
const tasks = require('../datalayer/tasks');
const users = require('../datalayer/users');

router.get('/', async (req, res) => {
	let query = '';
	let all_tasks = [];
	try {
		query = req.query['query'];
	} catch (e) {}

	if (query !== undefined && query.trim() !== '') {
		try {
			all_tasks = all_tasks.concat(
				await tasks.filterTasksByTagsAndName(query)
			);
		} catch (e) {
			console.log(e);
		}
	} else {
		all_tasks = await tasks.getAllTasks();
	}

	all_tasks = await Promise.all(
		all_tasks.map(async (task) => {
			let user = await users.getUser(task.createdBy);

			// assignedTo should be a user object. If we can't find the user then it is assigned to nobody.
			let assignedTo = null;
			try {
				assignedTo = await users.getUser(task.assignedTo);
			} catch (e) {}

			return {
				...task,
				createdBy: user.firstName + ' ' + user.lastName,
				assignedTo: assignedTo
					? assignedTo.firstName + ' ' + assignedTo.lastName
					: 'Nobody'
			};
		})
	);

	let task_sections = [
		{
			section_name: 'Pending',
			task_stage: 0,
			task_list: all_tasks.filter((task) => task.status === 0)
		},
		{
			section_name: 'In Progress',
			task_stage: 1,
			task_list: all_tasks.filter((task) => task.status === 1)
		},
		{
			section_name: 'Review',
			task_stage: 2,
			task_list: all_tasks.filter((task) => task.status === 2)
		},
		{
			section_name: 'Done',
			task_stage: 3,
			task_list: all_tasks.filter((task) => task.status === 3)
		}
	];

	res.render('../src/views/board/index', {
		title: 'Kanban Board',
		task_sections: task_sections
	});
});

module.exports = router;
