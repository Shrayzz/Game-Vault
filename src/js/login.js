const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db.js')

const port = 3000;
const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('file.css')); css

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../html/login.html'));
});

app.post('/auth', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const con = db.connect('localhost', 'root', 'root', 'simplegamelibrary');

        con.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results) {

            if (error) throw error;

            if (results.length > 0) { // empty if nothing found

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

app.get('/home', function (req, res) {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, '../../index.html'));
    } else {
        res.send('Please login to view this page!');
    }
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
