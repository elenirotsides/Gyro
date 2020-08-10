const express = require('express');
const router = express.Router();
const xss = require('xss');
const users = require('../datalayer/users');

router.get('/', async (req, res) => {
    res.render('../src/views/login/index', {
        title: 'Please signin',
    });
});

// I am making the assumption that we will have the user login with an email and password; no usernames
router.post('/', async (req, res) => {
    input = xss(req.body);
    // I haven't tested the below, and the logic may be bad right now but I'll make it better
    if (input['email']) {
        let user = await users.getUserByEmail(input['email']);
        if (user) {
            let correctPassword = user.checkPassword(input['password'], user.hashedPassword);
            if (correctPassword) {
                res.redirect('/board');
                /* I don't think I'm redirecting the user to the correct
                 place, but we'll figure that out eventually */
            } else {
                res.render('/login', { error: 'Something went wrong, please try again' });
            }
        }
    } else {
        res.render('/', { error: 'Could not find email, please try again' });
        //wrong path, I will fix that during testing
    }
});

module.exports = router;
