const mysql = require("mysql");

/**
 * Function to execute a SQL query
 * @param {object} con the database connection
 * @param {string} SQLquery the SQL query to execute
 * @param {string} output the output message
 */
function query(con, SQLquery, output) {
    con.query(SQLquery, function (err) {
        if (err) throw err;
        console.log(output);
    });
}

/**
 * Function to connect to the database
 * @param {string} host database host
 * @param {string} user database user
 * @param {string} password database password
 * @param {string} database database to use (needed if you dont use init(func) after creating the connection)
 * @returns {object} the database connection
 */
function connect(host, user, password, database = null) {
    const con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log('succesfully connected to DB');
    });

    return con;
}

/**
 * Function to end the connection to the database
 * @param {object} con database connection
 */
function disconnect(con) {
    con.end(function (err) {
        if (err) throw err;
        console.log('connection to DB successfully closed');
    });
}

/**
 * Function to initialize the database
 * (creation, tables)
 * @param {object} con database connection 
 */
// TODO: Ensure when adding data there can't be both or more of the same entry
function init(con) {
    const createDB = 'CREATE DATABASE IF NOT EXISTS SimpleGameLibrary';
    const loginTable = 'CREATE TABLE IF NOT EXISTS accounts (id int(11) NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL, password varchar(255) NOT NULL, email varchar(100) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const listTable = 'CREATE TABLE IF NOT EXISTS list (id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, favorite boolean DEFAULT false, accountId int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (accountID) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const gameTable = 'CREATE TABLE IF NOT EXISTS game(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, `release` date NOT NULL, publishers varchar(50) NOT NULL, developers varchar(50) NOT NULL, price float NOT NULL, rating int, description text, languages text, plateforms json, pcRequirement json, image blob, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const categoryTable = 'CREATE TABLE IF NOT EXISTS category(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;'
    const listHasGameTable = 'CREATE TABLE IF NOT EXISTS listHasGames(idList int(11) NOT NULL, idGame int(11) NOT NULL, PRIMARY KEY (idList, idGame), FOREIGN KEY (idList) REFERENCES list (id), FOREIGN KEY (idGame) REFERENCES game (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';
    const gameHasCategory = 'CREATE TABLE IF NOT EXISTS gameHasCategory(idGame int(11) NOT NULL, idCategory int(11) NOT NULL, PRIMARY KEY (idGame, idCategory), FOREIGN KEY (idGame) REFERENCES game (id), FOREIGN KEY (idCategory) REFERENCES category (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;';

    query(con, createDB, 'DB created');
    query(con, 'USE simplegamelibrary', 'using simplegamelibrary DB');
    query(con, loginTable, 'created account table');
    query(con, listTable, 'created list table');
    query(con, gameTable, 'created game table');
    query(con, categoryTable, 'created category table');
    query(con, listHasGameTable, 'created listHasGame table');
    query(con, gameHasCategory, 'created gameHasCategory table');

}

// Tests DB init + test DB insert
/*
// Initalise connection
const con = connect('localhost', 'root', 'root');
init(con);

// insertion tests
con.query('INSERT INTO accounts (username, password, email) VALUES(?, ?, ?);', ['test', 'test', 'test@email.com']);
con.query('INSERT INTO list (name, favorite, accountId) VALUES(?, ?, ?);', ['testList1', 0, 1]);
con.query('INSERT INTO list (name, favorite, accountId) VALUES(?, ?, ?);', ['testList2', 1, 1]);
con.query('INSERT INTO game (name, `release`, publishers, developers, price) VALUES(?, ?, ?, ?, ?);', ['testGame1', '2001-01-01', 'testPublisher1', 'testDevelopers1', 12]);
con.query('INSERT INTO game (name, `release`, publishers, developers, price) VALUES(?, ?, ?, ?, ?);', ['testGame2', '2002-02-02', 'testPublisher2', 'testDevelopers2', 25.50]);
con.query('INSERT INTO game (name, `release`, publishers, developers, price) VALUES(?, ?, ?, ?, ?);', ['testGame3', '2003-03-03', 'testPublisher2', 'testDevelopers1', 100.73]);
con.query('INSERT INTO category (name) VALUES(?);', ['testCategory1']);
con.query('INSERT INTO category (name) VALUES(?);', ['testCategory2']);
con.query('INSERT INTO category (name) VALUES(?);', ['testCategory3']);
con.query('INSERT INTO listHasGames (idList, idGame) VALUES(?, ?);', [1, 1]);
con.query('INSERT INTO listHasGames (idList, idGame) VALUES(?, ?);', [1, 2]);
con.query('INSERT INTO listHasGames (idList, idGame) VALUES(?, ?);', [2, 2]);
con.query('INSERT INTO listHasGames (idList, idGame) VALUES(?, ?);', [2, 3]);
con.query('INSERT INTO gameHasCategory (idGame, idCategory) VALUES(?, ?);', [1, 1]);
con.query('INSERT INTO gameHasCategory (idGame, idCategory) VALUES(?, ?);', [1, 2]);
con.query('INSERT INTO gameHasCategory (idGame, idCategory) VALUES(?, ?);', [2, 3]);
con.query('INSERT INTO gameHasCategory (idGame, idCategory) VALUES(?, ?);', [3, 1]);
con.query('INSERT INTO gameHasCategory (idGame, idCategory) VALUES(?, ?);', [3, 2]);
con.query('INSERT INTO gameHasCategory (idGame, idCategory) VALUES(?, ?);', [3, 3]);

// Ending connection
disconnect(con);
*/

module.exports = { connect, disconnect, init };