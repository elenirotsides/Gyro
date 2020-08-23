const tasks = require('./mongoCollections').tasks;
const users = require('../datalayer/users');
const ObjectID = require('mongodb').ObjectID;
const verify = require('../util/verify');
const { str } = require('../util/verify');

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
	verify.tags(tags);

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

const getTask = async (id) => {
	verify.objID(id);

	let collection = await tasks();

	let obj = await collection.findOne({ _id: ObjectID(id) });
	if (obj === null) throw new Error('No task found with ID ' + id);

	return obj;
};

/**
 * Update task of `id`, with a dictionary of updated values.
 * These updated values are validated before being submitted.
 * The supported update variables are:
 * { taskName, description, createdBy, assignedTo, status, tags, comments }
 */
const updateTask = async (id, changes) => {
	let collection = await tasks();

	let validatedChanges = {};

	verify.obj(changes);

	// selectively validate and copy changes from `changes` to `validatedChanges`
	// object before executing update query on mongodb
	{
		if ('taskName' in changes) {
			verify.str(changes.taskName);
			validatedChanges.taskName = changes.taskName;
		}

		if ('description' in changes) {
			verify.str(changes.description);
			validatedChanges.description = changes.description;
		}

		if ('createdBy' in changes) {
			validatedChanges.createdBy = changes.createdBy;
		}

		if ('assignedTo' in changes) {
			validatedChanges.assignedTo = changes.assignedTo;
		}

		if ('status' in changes) {
			verify.num(changes.status);
			validatedChanges.status = changes.status;
		}

		if ('tags' in changes) {
			verify.tags(changes.tags);
			validatedChanges.tags = changes.tags.map((tag) =>
				tag.toLowerCase().substring(0, 24)
			);
		}

		if ('comments' in changes) {
			verify.comments(changes.comments);
			validatedChanges.comments = changes.comments;
		}
	}

	let now = new Date();

	let result = await collection.updateOne(
		{ _id: ObjectID(id) },
		{
			$set: {
				...validatedChanges,
				lastUpdated: now
			}
		}
	);

	if (result.modifiedCount === 0) {
		throw new Error('Could not update task with ID ' + id);
	}
};

const deleteTask = async (id) => {
	verify.objID(id);

	let collection = await tasks();

	let obj = await getTask(id);

	let result = await collection.deleteOne({ _id: ObjectID(id) });
	if (result.deletedCount === 0)
		throw new Error('Could not delete task with ID ' + id);

	return obj;
};

const getAllTasks = async () => {
	const collection = await tasks();
	const taskList = await collection.find({}).toArray();
	return taskList;
};

const filterTasksByTagsAndName = async (pattern) => {
	verify.str(pattern);

	// for easy matching
	pattern = pattern.toLowerCase();

	let collection = await tasks();

	let objs = await collection
		.aggregate([
			// an array of all tasks
			{ $project: { tags: 1, taskName: 1 } },
			// {_id: XXX, tags: ["tag1", "tag2"]}
			{ $unwind: '$tags' },
			// {_id: XXX, tags: "tag1"}, {_id: XXX, tags: "tag2"}
			{
				$match: {
					$or: [
						{ tags: { $regex: new RegExp(pattern, 'i') } },
						{ taskName: { $regex: new RegExp(pattern, 'i') } }
					]
				}
			}
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

const addComment = async (id, userID, comment) => {
	verify.objID(id);

	let comments = (await getTask(id)).comments;
	comments = comments.concat([{ user: userID, comment: comment }]);

	await updateTask(id, { comments: comments });
	return await getTask(id);
};

module.exports = {
	addTask,
	getTask,
	updateTask,
	deleteTask,
	getAllTasks,
	filterTasksByTagsAndName,
	addComment
};
