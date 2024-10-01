//----------------------------------DATABASE----------------------------------\\

// Get the client
import mysql from 'mysql2/promise';

/**
 * Create the connection to database
 * @param {string} host the host
 * @param {string} user the user
 * @param {string} password the password
 * @param {string} database the database
 * @returns {object} the database connection
 */
// TODO: create pool connection
async function dbConnect(host, user, password, database) {

    const con = await mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database,
    });

    return con;
}

/**
 * Create the connection to database
 * @param {string} host the host
 * @param {string} user the user
 * @param {string} password the password
 * @returns {object} the server connection
 */
// TODO: create pool connection
async function dbConnectServer(host, user, password) {

    const serv = await mysql.createConnection({
        host: host,
        user: user,
        password: password,
    });

    return serv;
}

/**
 * Initialise the database with the tables if not exists
 */
async function dbInit() {
    //Create DataBase
    const serv = await dbConnectServer('localhost', 'root', 'root')

    const SimpleGameLibraryDatabase = 'CREATE DATABASE IF NOT EXISTS SimpleGameLibrary;';

    await serv.query(SimpleGameLibraryDatabase);

    await dbDisconnect(serv);
    //Create Tables
    const con = await dbConnect('localhost', 'root', 'root', 'simplegamelibrary');

    const loginTable = 'CREATE TABLE IF NOT EXISTS accounts (id int(11) NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL UNIQUE, password varchar(255) NOT NULL, email varchar(100) NOT NULL UNIQUE, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const listTable = 'CREATE TABLE IF NOT EXISTS list (id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, favorite boolean DEFAULT false, accountId int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (accountID) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const gameTable = 'CREATE TABLE IF NOT EXISTS game(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, `release` date NOT NULL, publishers varchar(50) NOT NULL, developers varchar(50) NOT NULL, price float NOT NULL, rating int, description text, languages text, plateforms json, pcRequirement json, image blob, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const categoryTable = 'CREATE TABLE IF NOT EXISTS category(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;'
    const listHasGameTable = 'CREATE TABLE IF NOT EXISTS listHasGames(idList int(11) NOT NULL, idGame int(11) NOT NULL, PRIMARY KEY (idList, idGame), FOREIGN KEY (idList) REFERENCES list (id), FOREIGN KEY (idGame) REFERENCES game (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const gameHasCategory = 'CREATE TABLE IF NOT EXISTS gameHasCategory(idGame int(11) NOT NULL, idCategory int(11) NOT NULL, PRIMARY KEY (idGame, idCategory), FOREIGN KEY (idGame) REFERENCES game (id), FOREIGN KEY (idCategory) REFERENCES category (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';

    con.query(loginTable);
    con.query(listTable);
    con.query(gameTable);
    con.query(categoryTable);
    con.query(listHasGameTable);
    con.query(gameHasCategory);

    await dbDisconnect(con);
}

/**
 * Disconnect the Database
 * @param {object} con your database to disconnect 
 */
async function dbDisconnect(con) {
    con.end(function (err) {
        if (err) throw err;
        console.log('connection to DB successfully closed');
    });
}

//----------------------------------Boolean Method----------------------------------\\

/**
 * Return is an user exist with his username or email
 * @param {object} con your connetion
 * @param {string} id the username or email of the user
 * @returns {boolean} true if the user exist and false if the user does not exist
 */
async function existUser(con, id) {
    try {
        const sql = 'SELECT id, username, email FROM accounts WHERE username = ? OR email = ?;';
        const values = [id, id];

        const [rows] = await con.query(sql, values);

        if (rows.length === 1) {
            return true;
        }
        return false;

    } catch (err) {
        console.log(err);
    }
}

//----------------------------------SELECT----------------------------------\\

/**
 * Get the password of an user from his username or email
 * @param {object} con your connection
 * @param {string} id the username or email of the user
 * @returns {string} the password of the user or undefined
 */
async function getUserPassword(con, id) {
    try {
        const sql = 'SELECT password FROM accounts WHERE username = ? OR email = ?;';
        const values = [id, id];

        const [rows] = await con.query(sql, values);

        return rows[0]?.password;

    } catch (err) {
        console.log(err);
    }
}

//----------------------------------INSERT----------------------------------\\

/**
 * Insert a new user into the database
 * @param {object} con your connection
 * @param {string} username the username of your user
 * @param {string} email the email of your user
 * @param {string} password the password of your user
 * @returns {boolean} if the user creation succeed
 */
async function createUser(con, username, email, password) {
    try {
        const sql = 'INSERT INTO accounts(username, password, email) VALUES(?, ?, ?)';
        const values = [username, password, email];

        await con.query(sql, values);

        return true;

    } catch (err) {
        console.log(err);
        return false;
    }
}

//----------------------------------UPDATE----------------------------------\\



//----------------------------------DELETE----------------------------------\\



//----------------------------------TESTS----------------------------------\\

/**
 * Test existUser function
 */
async function testExistUser() {
    await dbInit();
    const con = await dbConnect('localhost', 'root', 'root', 'simplegamelibrary');
    console.log(await existUser(con, 'test2'));
    console.log(await existUser(con, 'jesuisuntest@email.com'));
    console.log(await existUser(con, 'badNameOrEmail'));
    await dbDisconnect(con);
}

/**
 * Test getUserPassword function
 */
async function testGetUserPassword() {
    await dbInit();
    const con = await dbConnect('localhost', 'root', 'root', 'simplegamelibrary');
    console.log(await getUserPassword(con, 'test2'));
    console.log(await getUserPassword(con, 'jesuisuntest@email.com'));
    console.log(await getUserPassword(con, 'badNameOrEmail'));
    await dbDisconnect(con);
}

/**
 * Test createUser function
 */
async function testCreateUser() {
    await dbInit();
    const con = await dbConnect('localhost', 'root', 'root', 'simplegamelibrary');
    console.log(await createUser(con, 'insertTest', 'insert@test.testing', 'insertTestPWD'));
    await dbDisconnect(con);
}

// (async () => {
//     await dbConnectServer('localhost', 'root', 'root');
//     await testCreateUser();
// })();

export default { dbConnectServer, dbConnect, dbInit, existUser, getUserPassword, createUser };