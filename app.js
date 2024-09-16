const express = require('express');
const session = require('express-session');
const path = require('path');
const authRouter = require('./src/routes/auth');
const homeRouter = require('./src/routes/home');

const port = 3000;
const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, './src/public')))

app.use('/', authRouter);
app.use('/', homeRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
