const dbConnection = require('../datalayer/mongoConnection');
const users = require('../datalayer/users');
const tasks = require('../datalayer/tasks');
const auth = require('../util/auth');

const main = async () => {
	const db = await dbConnection();
	await db.dropDatabase();

	let pass = 'password';

	let userWes = await users.addUser(
		'Wes',
		'LaFerriere',
		'wes.laf@email.com',
		pass
	);

	let userEleni = await users.addUser(
		'Eleni',
		'Rotsides',
		'eleni.rot@email.com',
		pass
	);

	let userWill = await users.addUser(
		'Will',
		'Deroberts',
		'will.der@email.com',
		pass
	);

	let userCass = await users.addUser(
		'Cassidy',
		'Bickler',
		'cbick@email.com',
		pass
	);

	await tasks.addTask(
		'Create the proof of concept',
		'Patrick Hill seemed really intent on this feature.',
		String(userEleni._id),
		String(userEleni._id),
		3,
		['milestone']
	);

	await tasks.addTask(
		'Add google integration',
		'For the future this will be good.',
		String(userWes._id),
		String(userWes._id),
		0,
		['feature']
	);

	await tasks.addTask(
		'Fix major bug before demo',
		'Please do this before we submit...',
		String(userWill._id),
		String(userWill._id),
		1,
		['bug']
	);

	await tasks.addTask(
		'Deploy to live webserver',
		'For fun!',
		String(userCass._id),
		String(userCass._id),
		2,
		['milestone']
	);

	await tasks.addTask(
		'Submit the project',
		'Do not forget this!',
		String(userWill._id),
		String(userWill._id),
		3,
		['milestone']
	);

	console.log('Database initialized.');
	await db.serverConfig.close();
};

main().catch(console.log);
