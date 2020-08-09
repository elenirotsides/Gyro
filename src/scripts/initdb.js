const dbConnection = require("../datalayer/mongoConnection");
const users = require("../datalayer/users");
const tasks = require("../datalayer/tasks");
const auth = require("../util/auth");

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    let pass = "password";

    let userWes = await users.addUser("Wes", "LaFerriere", "wes.laf@email.com", pass);
    let result = userWes.checkPassword(pass);
    console.log(userWes);

    userWes = await users.getUserByEmail("wes.laf@email.com");
    console.log(userWes);

    let newTask = await tasks.addTask("Add actual functionality", String(userWes._id), 0, ['boring', 'notgonnadoit']);
    console.log(newTask);
    newTask = await tasks.setTaskName(String(newTask._id), "new name");
    newTask = await tasks.setTaskStatus(String(newTask._id), 1);
    newTask = await tasks.setTaskTags(String(newTask._id), ["new", "tags"]);
    newTask = await tasks.addComment(String(newTask._id), "Wes", "this is a comment");
    
    console.log(newTask);

    console.log("Database initialized.");
    await db.serverConfig.close();
};

main().catch(console.log);