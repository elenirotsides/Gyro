const tasks = require('./mongoCollections').tasks;
const ObjectID = require('mongodb').ObjectID;
const verify = require('../util/verify');

const addTask = async (taskName, createdBy, status, tags) => {
    verify.str(taskName);
    verify.str(createdBy);
    verify.num(status);
    verify.nonzeroArr(tags);
    
    let collection = await tasks();

    let now = new Date();

    let insertInfo = await collection.insertOne({
        taskName: taskName,
        createdBy: createdBy,
        status: status,
        tags: tags,
        comments: [],
        postedDate: now,
        lastUpdated: now
    });

    let id = insertInfo.insertedId;

    if(id === 0) throw new Error("Insertion error!");

    return await getTask(String(id));
}

const getTask = async (id) => {
    verify.str(id);

    let collection = await tasks();

    let obj = await collection.findOne({_id: ObjectID(id)});
    if(obj === null) throw new Error("No task found with ID " + id);

    return obj;
}

const setTaskTags = async (id, tags) => {
    verify.nonzeroArr(tags);
    await _updateTask(id, {tags: tags});
    return await getTask(id);
}

const setTaskName = async (id, name) => {
    verify.str(name);
    await _updateTask(id, {name: name});
    return await getTask(id);
}

const setTaskStatus = async (id, status) => {
    verify.num(status);
    await _updateTask(id, {status: status});
    return await getTask(id);
}

const addComment = async (id, name, comment) => {
    verify.str(name);
    verify.str(comment);

    let comments = (await getTask(id)).comments;
    comments = comments.concat([{name: name, comment: comment}]);

    await _updateTask(id, {comments: comments});
    return await getTask(id);
}

// private utility for this file
const _updateTask = async (id, changes) => {
    let collection = await tasks();

    let now = new Date();

    let result = await collection.updateOne({_id: ObjectID(id)}, {
        $set: {
            ...changes,
            lastUpdated: now
        }
    });

    if (result.modifiedCount === 0) {
        throw new Error("Could not update task with ID " + id);
    }
}

module.exports = { addTask, getTask, setTaskName, setTaskTags, setTaskStatus, addComment };