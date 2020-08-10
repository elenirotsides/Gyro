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
const nonzeroArr = (x) => {
	arr(x);
	if (x.length <= 0) throw new Error('Array length must be more than zero!');
};

module.exports = { type, str, num, arr, nonzeroArr };
