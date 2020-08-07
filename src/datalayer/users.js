const users = require('./mongoCollections').users;
const ObjectID = require('mongodb').ObjectID;
const verify = require('../util/verify');
const auth = require('../util/auth');

const addUser = async (firstName, lastName, email, plaintextPassword) => {
    verify.str(firstName);
    verify.str(lastName);
    verify.str(email);
    verify.str(plaintextPassword);

    let hashedPassword = auth.genHash(plaintextPassword);
    
    let collection = await users();

    let insertInfo = await collection.insertOne({
        firstName: firstName,
        lastName: lastName,
        email: email,
        hashedPassword: hashedPassword,
        isAdmin: false,
        tasksCreated: []
    });

    let id = insertInfo.insertedId;

    if(id === 0) throw new Error("Insertion error!");

    return await getUser(String(id));
}

const getUser = async(id) => {
    verify.str(id);

    let collection = await users();

    let obj = await collection.findOne({_id: ObjectID(id)});
    if(obj === null) throw new Error("No user found with ID " + id);

    // inject a checkPassword function into user objects
    let objWithFunction = {
        ...obj,
        checkPassword: pass => auth.check(pass, obj.hashedPassword)
    }

    return objWithFunction;
}

module.exports = { addUser, getUser };