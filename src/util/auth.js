// utility functions so we don't need to work with bcrypt directly
// if you're using bcrypt anywhere else, you are making a mistake

const bcrypt = require('bcrypt');
const saltRounds = 10;

const genHash = (pass) => {
	let salt = bcrypt.genSaltSync(saltRounds);
	return bcrypt.hashSync(pass, salt);
};

const check = (pass, hash) => {
	let result = bcrypt.compareSync(pass, hash);
	return result;
};

module.exports = { genHash, check };
