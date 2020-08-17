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
	verify.arr(tags);

	let collection = await tasks();

	let now = new Date();

	let insertInfo = await collection.insertOne({
		taskName: taskName,
		description: description,
		createdBy: createdBy,
		assignedTo: assignedTo,
		status: status,
		tags: tags.map((tag) => tag.toLowerCase()),
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

	// for easy matching
	tag = tag.toLowerCase();

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
	await rawUpdateTask(id, {
		taskName: taskName,
		description: description,
		createdBy: createdBy,
		assignedTo: assignedTo,
		status: status,
		tags: tags ? tags.map((tag) => tag.toLowerCase()) : null
	});
};

const setTaskTags = async (id, tags) => {
	verify.nonzeroArr(tags);
	await rawUpdateTask(id, { tags: tags });
	return await getTask(id);
};

const setTaskName = async (id, name) => {
	verify.str(name);
	await rawUpdateTask(id, { name: name });
	return await getTask(id);
};

const setTaskStatus = async (id, status) => {
	verify.num(status);
	await rawUpdateTask(id, { status: status });
	return await getTask(id);
};

const addComment = async (id, userID, comment) => {
	verify.str(userID);
	verify.str(comment);

	let comments = (await getTask(id)).comments;
	comments = comments.concat([{ user: userID, comment: comment }]);

	await rawUpdateTask(id, { comments: comments });
	return await getTask(id);
};

// private utility for this file
const rawUpdateTask = async (id, changes) => {
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
	addComment,
	rawUpdateTask
};
