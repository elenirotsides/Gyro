const tasks = require('./mongoCollections').tasks;
const ObjectID = require('mongodb').ObjectID;
const verify = require('../util/verify');

const addTask = async (
	taskName,
	description,
	createdBy,
	assignedTo,
	status,
	tags
) => {
	verify.str(taskName);
	verify.str(description);
	verify.str(createdBy);
	verify.str(assignedTo);
	verify.num(status);
	verify.nonzeroArr(tags);

	let collection = await tasks();

	let now = new Date();

	let insertInfo = await collection.insertOne({
		taskName: taskName,
		description: description,
		createdBy: createdBy,
		assignedTo: assignedTo,
		status: status,
		tags: tags,
		comments: [],
		postedDate: now,
		lastUpdated: now
	});

	let id = insertInfo.insertedId;

	if (id === 0) throw new Error('Insertion error!');

	return await getTask(String(id));
};

const deleteTask = async (id) => {
	verify.str(id);

	let collection = await tasks();

	let obj = await getTask(id);

	let result = await collection.deleteOne({ _id: ObjectID(id) });
	if (result.deletedCount === 0)
		throw new Error('Could not delete task with ID ' + id);

	return obj;
};

const getTask = async (id) => {
	verify.str(id);

	let collection = await tasks();

	let obj = await collection.findOne({ _id: ObjectID(id) });
	if (obj === null) throw new Error('No task found with ID ' + id);

	return obj;
};

const getTasksByTag = async (tag) => {
	verify.str(tag);

	let collection = await tasks();

	let objs = await collection
		.aggregate([
			// an array of all tasks
			{ $project: { tags: 1 } },
			// {_id: XXX, tags: ["tag1", "tag2"]}
			{ $unwind: '$tags' },
			// {_id: XXX, tags: "tag1"}, {_id: XXX, tags: "tag2"}
			{ $match: { tags: { $regex: '^' + tag } } }
			// set is now filtered for matching tags
		])
		.toArray();
	let matchingIDs = objs.map((match) => String(match._id));
	matchingIDs = matchingIDs.filter((v, i, s) => s.indexOf(v) === i); // unique filter
	let matchingObjs = await Promise.all(
		matchingIDs.map(async (id) => await getTask(id))
	);

	return matchingObjs;
};

const getTaskByName = async (name) => {
	verify.str(name);

	let collection = await tasks();

	let obj = await collection.findOne({
		taskName: { $regex: '^' + name }
	});
	if (obj === null)
		throw new Error('No task found with similar name to "' + name + '"');

	return obj;
};

const getAllTasks = async () => {
	const collection = await tasks();

	const taskList = await collection.find({}).toArray();

	return taskList;
};

const updateTask = async (
	id,
	taskName,
	description,
	createdBy,
	assignedTo,
	status,
	tags
) => {
	await _updateTask(id, {
		taskName: taskName,
		description: description,
		createdBy: createdBy,
		assignedTo: assignedTo,
		status: status,
		tags: tags
	});
};

const setTaskTags = async (id, tags) => {
	verify.nonzeroArr(tags);
	await _updateTask(id, { tags: tags });
	return await getTask(id);
};

const setTaskName = async (id, name) => {
	verify.str(name);
	await _updateTask(id, { name: name });
	return await getTask(id);
};

const setTaskStatus = async (id, status) => {
	verify.num(status);
	await _updateTask(id, { status: status });
	return await getTask(id);
};

const addComment = async (id, name, comment) => {
	verify.str(name);
	verify.str(comment);

	let comments = (await getTask(id)).comments;
	comments = comments.concat([{ name: name, comment: comment }]);

	await _updateTask(id, { comments: comments });
	return await getTask(id);
};

// private utility for this file
const _updateTask = async (id, changes) => {
	let collection = await tasks();

	let now = new Date();

	let result = await collection.updateOne(
		{ _id: ObjectID(id) },
		{
			$set: {
				...changes,
				lastUpdated: now
			}
		}
	);

	if (result.modifiedCount === 0) {
		throw new Error('Could not update task with ID ' + id);
	}
};

module.exports = {
	addTask,
	deleteTask,
	updateTask,
	getTask,
	getTaskByName,
	getTasksByTag,
	getAllTasks,
	setTaskName,
	setTaskTags,
	setTaskStatus,
	addComment
};
