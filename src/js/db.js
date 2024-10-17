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
async function dbConnect(host, user, password, database) {
    const con = await mysql.createPool({
        host: host,
        user: user,
        password: password,
        database: database,
    });

    return await con.getConnection();
}

/**
 * Create the connection to server
 * @param {string} host the host
 * @param {string} user the user
 * @param {string} password the password
 * @returns {object} the server connection
 */
async function dbConnectServer(host, user, password) {
    const serv = await mysql.createPool({
        host: host,
        user: user,
        password: password
    });

    return await serv.getConnection();
}

/**
 * Initialise the database with the tables if not exists
 */
async function dbInit() {
    //Create DataBase
    const serv = await dbConnectServer('localhost', 'root', 'root');

    const SimpleGameLibraryDatabase = 'CREATE DATABASE IF NOT EXISTS SimpleGameLibrary;';

    await serv.query(SimpleGameLibraryDatabase);

    await dbDisconnect(serv);
    //Create Tables
    const con = await dbConnect('localhost', 'root', 'root', 'simplegamelibrary');

    const accountsTable = 'CREATE TABLE IF NOT EXISTS accounts (id int(11) NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL UNIQUE, password varchar(255) NOT NULL, email varchar(100) NOT NULL UNIQUE, token varchar(96) UNIQUE, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const listTable = 'CREATE TABLE IF NOT EXISTS list (id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, favorite boolean DEFAULT false, accountId int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (accountID) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const gameTable = 'CREATE TABLE IF NOT EXISTS game(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, `release` date NOT NULL, publishers varchar(50) NOT NULL, developers varchar(50) NOT NULL, price float NOT NULL, rating int, description text, languages text, plateforms json, pcRequirement json, image blob, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const categoryTable = 'CREATE TABLE IF NOT EXISTS category(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;'
    const listHasGameTable = 'CREATE TABLE IF NOT EXISTS listHasGames(idList int(11) NOT NULL, idGame int(11) NOT NULL, PRIMARY KEY (idList, idGame), FOREIGN KEY (idList) REFERENCES list (id), FOREIGN KEY (idGame) REFERENCES game (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const gameHasCategory = 'CREATE TABLE IF NOT EXISTS gameHasCategory(idGame int(11) NOT NULL, idCategory int(11) NOT NULL, PRIMARY KEY (idGame, idCategory), FOREIGN KEY (idGame) REFERENCES game (id), FOREIGN KEY (idCategory) REFERENCES category (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';

    await con.query(accountsTable);
    await con.query(listTable);
    await con.query(gameTable);
    await con.query(categoryTable);
    await con.query(listHasGameTable);
    await con.query(gameHasCategory);

    await dbDisconnect(con);
}

/**
 * Disconnect the Database
 * @param {object} con your database to disconnect 
 */
async function dbDisconnect(con) {
    con.release(function (err) {
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

async function existEmail(con, id) {
    try {
        const sql = 'SELECT email FROM accounts WHERE email = ?;';

        const [rows] = await con.query(sql, id);

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

/**
 * Get the token of an user from his username or email
 * @param {object} con your connection
 * @param {string} id the username or email of the user
 * @returns {string} the token of the user or undefined
 */
async function getUserToken(con, id) {
    try {
        const sql = 'SELECT token FROM accounts WHERE username = ? OR email = ?;';
        const values = [id, id];

        const [rows] = await con.query(sql, values);

        return rows[0]?.token;

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

/**
 * Update the account to add a new token
 * @param {object} con your connection
 * @param {string} username the user to add a login token 
 * @param {*} token the token value
 * @returns {boolean} if the token was successfully added
 */
async function addToken(con, username, token) {
    try {
        const sql = 'UPDATE accounts SET token = ? WHERE username = ?;';
        const values = [token, username];

        await con.query(sql, values);
        return true;

    } catch (err) {
        console.log(err);
        return false;
    }
}

//----------------------------------DELETE----------------------------------\\



//----------------------------------TESTS----------------------------------\\

/**
 * Create a test Database if not exists and add data to tables
 */
async function startTests() {
    //Create test Database
    const serv = await dbConnectServer('localhost', 'root', 'root');

    const SimpleGameLibraryTestDatabase = "CREATE DATABASE IF NOT EXISTS SimpleGameLibraryTest;"

    await serv.query(SimpleGameLibraryTestDatabase);

    await dbDisconnect(serv);

    //Create Tables in test Database

    const con = await dbConnect('localhost', 'root', 'root', 'simplegamelibrarytest');

    const accountsTable = 'CREATE TABLE IF NOT EXISTS accounts (id int(11) NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL UNIQUE, password varchar(255) NOT NULL, email varchar(100) NOT NULL UNIQUE, token varchar(96) UNIQUE, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const listTable = 'CREATE TABLE IF NOT EXISTS list (id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, favorite boolean DEFAULT false, accountId int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (accountID) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const gameTable = 'CREATE TABLE IF NOT EXISTS game(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, `release` date NOT NULL, publishers varchar(50) NOT NULL, developers varchar(50) NOT NULL, price float NOT NULL, rating int, description text, languages text, plateforms json, pcRequirement json, image blob, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const categoryTable = 'CREATE TABLE IF NOT EXISTS category(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;'
    const listHasGameTable = 'CREATE TABLE IF NOT EXISTS listHasGames(idList int(11) NOT NULL, idGame int(11) NOT NULL, PRIMARY KEY (idList, idGame), FOREIGN KEY (idList) REFERENCES list (id), FOREIGN KEY (idGame) REFERENCES game (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const gameHasCategory = 'CREATE TABLE IF NOT EXISTS gameHasCategory(idGame int(11) NOT NULL, idCategory int(11) NOT NULL, PRIMARY KEY (idGame, idCategory), FOREIGN KEY (idGame) REFERENCES game (id), FOREIGN KEY (idCategory) REFERENCES category (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';

    con.query(accountsTable);
    con.query(listTable);
    con.query(gameTable);
    con.query(categoryTable);
    con.query(listHasGameTable);
    con.query(gameHasCategory);

    //Insert data in test Database

    const accountsTableData = "INSERT INTO accounts (username, password, email) VALUES('test1', 'test', 'test@email.com'), ('test2', 'ABCDE', 'LeTest@email.fr'), ('test3', 'AZERTY', 'jesuisuntest@email.com');";
    const listTableData = "INSERT INTO list (name, favorite, accountId) VALUES('testList1', 0, 1), ('testList2', 1, 1);";
    const gameTableData = "INSERT INTO game (name, `release`, publishers, developers, price) VALUES('testGame1', '2001-01-01', 'testPublisher1', 'testDevelopers1', 12), ('testGame2', '2002-02-02', 'testPublisher2', 'testDevelopers2', 25.50), ('testGame3', '2003-03-03', 'testPublisher2', 'testDevelopers1', 100.73);";
    const categoryTableData = "INSERT INTO category (name) VALUES('testCategory1'), ('testCategory2'), ('testCategory3');";
    const listHasGameTableData = "INSERT INTO listHasGames (idList, idGame) VALUES(1, 1), (1, 2), (2, 2), (2, 3);";
    const gameHasCategoryData = "INSERT INTO gameHasCategory (idGame, idCategory) VALUES(1, 1), (1, 2), (2, 3), (3, 1), (3, 2), (3, 3);";

    con.query(accountsTableData);
    con.query(listTableData);
    con.query(gameTableData);
    con.query(categoryTableData);
    con.query(listHasGameTableData);
    con.query(gameHasCategoryData);

    return con;
}

async function endTests(con) {
    // Drop all datas
    const listHasGameTableDataDrop = "DELETE FROM listHasGames;";
    const gameHasCategoryDataDrop = "DELETE FROM gameHasCategory;";
    const listTableDataDrop = "DELETE FROM list;";
    const accountsTableDataDrop = "DELETE FROM accounts";
    const gameTableDataDrop = "DELETE FROM game;";
    const categoryTableDataDrop = "DELETE FROM category;";
    const accountTableIncrementReset = "ALTER TABLE accounts AUTO_INCREMENT = 1;";
    const listTableIncrementReset = "ALTER TABLE list AUTO_INCREMENT = 1;";
    const gameTableIncrementReset = "ALTER TABLE game AUTO_INCREMENT = 1;";
    const categoryTableIncrementReset = "ALTER TABLE category AUTO_INCREMENT = 1;";

    await con.query(listHasGameTableDataDrop);
    await con.query(gameHasCategoryDataDrop);
    await con.query(listTableDataDrop);
    await con.query(accountsTableDataDrop);
    await con.query(gameTableDataDrop);
    await con.query(categoryTableDataDrop);
    await con.query(accountTableIncrementReset);
    await con.query(listTableIncrementReset);
    await con.query(gameTableIncrementReset);
    await con.query(categoryTableIncrementReset);

    await dbDisconnect(con);
}

/**
 * Test existUser function
 */
async function testExistUser(con) {
    console.log(await existUser(con, 'test2'));
    console.log(await existUser(con, 'jesuisuntest@email.com'));
    console.log(await existUser(con, 'badNameOrEmail'));
}

/**
 * Test existEmail function
 */
async function testExistEmail(con) {
    console.log(await existEmail(con, 'a@a.com'));
}

/**
 * Test getUserPassword function
 */
async function testGetUserPassword(con) {
    console.log(await getUserPassword(con, 'test2'));
    console.log(await getUserPassword(con, 'jesuisuntest@email.com'));
    console.log(await getUserPassword(con, 'badNameOrEmail'));
}

/**
 * Test createUser function
 */
async function testCreateUser(con) {
    console.log(await createUser(con, 'insertTest', 'insert@test.testing', 'insertTestPWD'));
}

//TODO: testUserToken

// Test executions

/*
(async () => {
    const con = await startTests();

    await testExistUser(con);
    await testExistEmail(con);
    await testGetUserPassword(con);
    await testCreateUser(con);

    await endTests(con);
})();
*/

export default { dbConnectServer, dbConnect, dbInit, existUser, getUserPassword, existEmail, createUser, addToken, getUserToken };