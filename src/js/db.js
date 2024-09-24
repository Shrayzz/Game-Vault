// Get the client
const mysql = require('mysql2');

/**
 * Function to connect to the database
 * @param {string} host database host
 * @param {string} user database user
 * @param {string} password database password
 * @param {string} database database to use (needed if you dont use init(func) after creating the connection)
 * @returns {object} the database connection
 */
function connect(host, user, password, database) {
    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database,
    });

    connection.connect(function (err) {
        if (err) throw err;
        console.log('succesfully connected to DB');
    });

    return connection;
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

/*
//Exemple de SELECT
function getAllGames(connection) {
    connection.query(
        'SELECT * FROM game',
        function (err, results) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(results);
        }
    );
}

con = connect('localhost', 'root', 'root', 'simplegamelibrary');

getAllGames(con);

disconnect(con);
*/