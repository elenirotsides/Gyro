const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('../src/views/login/register');
});

router.post('/', async (req, res) => {
    input = xss(req.body);

    //add user to users table
    //log user in
    //route to kanban board

    //NOTE: for now, I'm sending jsons, but I will edit this later so it injects error into a handlebar file or something
    //Whoever is doing the html should make the fields 'required' in the form using the required keyword so the browser
    //forces the user to write stuff in the mandatory fields, the error handling below would be an added precaution
    if (!input['firstName']) {
        res.status(400).json({ error: 'You must provide a first name' });
    }
    if (!input['lastName']) {
        res.status(400).json({ error: 'You must provide a last name' });
    }
    if (!input['email']) {
        res.status(400).json({ error: 'You must provide an email address' });
    }
    if (!input['password']) {
        res.status(400).json({ error: 'You must provide a password' });
    }

    try {
        await usersData.addUser(
            input['firstName'],
            input['lastName'],
            input['email'].toLowerCase(),
            input['password']
        );
    } catch (e) {
        res.render('/register', { error: 'Whoops! Something has gone wrong, please try again.' }); //fix this
    }

    res.redirect('/login');
    // My logic is to make the user login themselves.
    // The login route takes care of redirecting them to the kanban board anyway, so I figured why do it here to
});

module.exports = router;
