const express = require('express');
const router = express.Router();
const tasks = require('../datalayer/tasks');
const users = require('../datalayer/users');

router.get('/', async (req, res) => {
	let all_tasks = await tasks.getAllTasks();

	all_tasks = await Promise.all(
		all_tasks.map(async (task) => {
			let user = await users.getUser(task.createdBy);
			return {
				...task,
				createdBy: user.firstName + ' ' + user.lastName
			};
		})
	);

	let task_sections = [
		{
			section_name: 'Pending',
			task_list: all_tasks.filter((task) => task.status === 0)
		},
		{
			section_name: 'In Progress',
			task_list: all_tasks.filter((task) => task.status === 1)
		},
		{
			section_name: 'Review',
			task_list: all_tasks.filter((task) => task.status === 2)
		},
		{
			section_name: 'Done',
			task_list: all_tasks.filter((task) => task.status === 3)
		}
	];

	res.render('../src/views/board/index', {
		task_sections: task_sections
	});
});

module.exports = router;
