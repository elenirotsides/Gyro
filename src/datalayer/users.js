const users = require('./mongoCollections').users;
const ObjectID = require('mongodb').ObjectID;
const verify = require('../util/verify');
const auth = require('../util/auth');

const getAllUsers = async () => {
	const collection = await users();
	const userList = await collection.find({}).toArray();
	return userList;
};

const addUser = async (firstName, lastName, email, plaintextPassword) => {
	verify.alphaStr(firstName);
	verify.alphaStr(lastName);
	verify.email(email);
	verify.str(plaintextPassword);

	let hashedPassword = auth.genHash(plaintextPassword);

	let collection = await users();

	let insertInfo = await collection.insertOne({
		firstName: firstName,
		lastName: lastName,
		email: email,
		hashedPassword: hashedPassword,
		isAdmin: false
	});

	let id = insertInfo.insertedId;

	if (id === 0) throw new Error('Insertion error!');

	return await getUser(String(id));
};

const getUser = async (id) => {
	verify.objID(id);

	let collection = await users();

	let obj = await collection.findOne({ _id: ObjectID(id) });
	if (obj === null) throw new Error('No user found with ID ' + id);

	// inject a checkPassword function into user objects
	let objWithFunction = {
		...obj,
		checkPassword: (pass) => auth.check(pass, obj.hashedPassword)
	};

	return objWithFunction;
};

const getUserByEmail = async (email) => {
	verify.email(email);

	let collection = await users();

	let obj = await collection.findOne({ email: email });
	if (obj === null) throw new Error('No user found with email ' + email);

	return getUser(String(obj._id));
};

module.exports = { getAllUsers, addUser, getUser, getUserByEmail };
