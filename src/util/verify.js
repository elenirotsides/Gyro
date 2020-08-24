// A utility class of pure functions that verify various inputs to the database.
// Used in datalayer exclusively.

const type = (typename, typecheck) => (obj) => {
	if (typeof obj === 'undefined')
		throw new Error('Object of type ' + typename + ' not found!');
	if (!typecheck(obj))
		throw new Error(
			'Expected ' + typename + ' but got a ' + typeof obj + '.'
		);
};
const str = type('string', (x) => typeof x === 'string');
const num = type('number', (x) => typeof x === 'number');
const arr = type('array', (x) => Array.isArray(x));
const obj = type('object', (x) => typeof x === 'object');
const nonzeroArr = (x) => {
	arr(x);
	if (x.length <= 0) throw new Error('Array length must be more than zero!');
};

const email = (x) => {
	str(x);
	// this scary regex will validate all emails
	// test it here: https://regex101.com/r/8IUL5k/1
	if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(x))
		throw new Error('Expected valid email, got nonsense instead!');
};

// verifies that a string is just alphabetical, vs alphanumeric or some other nonsense
const alphaStr = (x) => {
	str(x);
	// test the regex here: https://regex101.com/r/kFTQll/2
	if (!/^([a-z]|[A-Z])+$/.test(x))
		throw new Error('Expected alphabetical string, got nonsense instead!');
};

const objID = (x) => {
	str(x);
	if (x.length != 24)
		throw new Error(
			'Expected 24-character ObjectID string, got nonsense instead!'
		);
};

const tags = (x) => {
	arr(x);
	x.map((tag) => {
		str(tag);
		if (tag.length > 23) {
			throw new Error('Tags must be less than 24 characters!');
		}
	});
};

const commentObj = (x) => {
	obj(x);
	if (!('user' in x)) {
		throw new Error('Comment object does not have user ID!');
	}
	if (!('comment' in x)) {
		throw new Error('Comment object does not have comment string!');
	}
	objID(x.user);
	str(x.comment);
};

const comments = (x) => {
	arr(x);
	x.map(commentObj);
};

module.exports = {
	type,
	str,
	num,
	arr,
	obj,
	nonzeroArr,
	alphaStr,
	email,
	objID,
	tags,
	commentObj,
	comments
};
