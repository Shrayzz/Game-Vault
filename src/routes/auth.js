const express = require('express');
const path = require('path');
const db = require('../js/db');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

router.post('/auth', (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        const con = db.connect('localhost', 'root', 'root', 'simplegamelibrary');

        con.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (error, results) => {
            if (error) throw error;

            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
            db.disconnect(con);
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

module.exports = router;
