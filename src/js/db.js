//----------------------------------DATABASE----------------------------------\\

// Get the client
import mysql from 'mysql2/promise';

/**
 * Create the connection to database
 * @returns {object} the database connection
 */
// TODO: create pool connection
async function dbConnect() {
    const con = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'simplegamelibrary',
    });
    return con
}

/**
 * Initialise the database by creating the tables if not exists
 * @param {object} con your connection 
 */
async function dbInit(con) {
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

//----------------------------------SELECT----------------------------------\\

/**
 * Get the games of the database
 * @param {object} con your database
 * @returns {array[object]} return all games from the database
 */
async function getGames(con) {
    const [rows] = await con.query('SELECT * FROM game');
    return rows;
}

//----------------------------------INSERT----------------------------------\\



//----------------------------------DELETE----------------------------------\\



//----------------------------------TESTS----------------------------------\\

