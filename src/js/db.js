//----------------------------------DATABASE----------------------------------\\

// Get the client
import mysql from "mysql2/promise";

/**
 * Create the connection to database
 * @param {string} host the host
 * @param {string} user the user
 * @param {string} password the password
 * @param {string} database the database
 * @returns {object} the database connection
 */
async function dbConnect(host, user, password, database) {
  const pool = await mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    connectionLimit: Infinity,
  });

  return pool;
}

/**
 * Create the connection to server
 * @param {string} host the host
 * @param {string} user the user
 * @param {string} password the password
 * @returns {object} the server connection
 */
async function dbConnectServer(host, user, password) {
  const servPool = await mysql.createPool({
    host: host,
    user: user,
    password: password,
  });

  return await servPool;
}

/**
 * Initialise the database with the tables if not exists
 */
async function dbInit() {
  //Create DataBase
  const servPool = await dbConnectServer("localhost", "root", "root");
  const serv = await servPool.getConnection();

  const SimpleGameLibraryDatabase =
    "CREATE DATABASE IF NOT EXISTS SimpleGameLibrary;";

  await serv.query(SimpleGameLibraryDatabase);

  await dbDisconnect(servPool);
  //Create Tables
  const pool = await dbConnect("localhost", "root", "root", "SimpleGameLibrary");
  const con = await pool.getConnection();

  const accountsTable =
    "CREATE TABLE IF NOT EXISTS accounts (id int(11) NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL UNIQUE, password varchar(255) NOT NULL, email varchar(100) NOT NULL UNIQUE, image blob, token varchar(96) UNIQUE, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
  const listTable =
    "CREATE TABLE IF NOT EXISTS list (id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, favorite boolean DEFAULT false, accountId int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (accountid) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
  const gameTable =
    "CREATE TABLE IF NOT EXISTS game(id int(11) NOT NULL AUTO_INCREMENT, source varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
  const categoryTable =
    "CREATE TABLE IF NOT EXISTS category(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
  const listHasGameTable =
    "CREATE TABLE IF NOT EXISTS listHasGames(idList int(11) NOT NULL, idGame int(11) NOT NULL, PRIMARY KEY (idList, idGame), FOREIGN KEY (idList) REFERENCES list (id), FOREIGN KEY (idGame) REFERENCES game (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
  const gameHasCategory =
    "CREATE TABLE IF NOT EXISTS gameHasCategory(idGame int(11) NOT NULL, idCategory int(11) NOT NULL, PRIMARY KEY (idGame, idCategory), FOREIGN KEY (idGame) REFERENCES game (id), FOREIGN KEY (idCategory) REFERENCES category (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
  const api_token =
    "CREATE TABLE IF NOT EXISTS api_token(accountId int(11) NOT NULL, token varchar(255) NOT NULL, api_provider varchar(50) NOT NULL, exp_date timestamp, PRIMARY KEY (accountId, token), FOREIGN KEY (accountid) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"

  await con.query(accountsTable);
  await con.query(listTable);
  await con.query(gameTable);
  await con.query(categoryTable);
  await con.query(listHasGameTable);
  await con.query(gameHasCategory);
  await con.query(api_token);

  await dbDisconnect(pool);
}

/**
 * Disconnect the Database
 * @param {object} pool your database pool connection to disconnect
 */
async function dbDisconnect(pool) {
  const con = await pool.getConnection();
  try {
    await con.release();
    pool.end();
  } catch (err) {
    throw err;
  }
}

//----------------------------------Boolean Method----------------------------------\\

/**
 * Return is an user exist with his username or email
 * @param {object} pool your pool connection
 * @param {string} id the username or email of the user
 * @returns {boolean} true if the user exist and false if the user does not exist
 */
async function existUser(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql =
      "SELECT id, username, email FROM accounts WHERE username = ? OR email = ?;";
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

/**
 * 
 * @param {object} pool your pool connection
 * @param {string} id the email to check
 * @returns {boolean} true if the email exist and false if the email does not exist
 */
async function existEmail(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT email FROM accounts WHERE email = ?;";

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
 * Get selected datas from all accounts
 * @param {object} pool your pool connection
 * @param {Array[string]} columns array of the column(s) your need to get
 * @returns {object} data of all users asked
 */
async function getFromAllUsers(pool, columns) {
  try {
    const con = await pool.getConnection();
    if (columns.length <= 0) {
      throw new Error("getFromAllUsers => Le tableau 'columns' est vide");
    }
    let sql = "SELECT ";
    columns.forEach((element) => {
      sql += `${element}, `;
    });
    sql = sql.slice(0, -2);
    sql += " FROM accounts";
    const [rows] = await con.query(sql);

    return rows;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get selected datas from one account with his username or email
 * @param {object} pool your pool connection
 * @param {string} id the username or email of the user you want data(s)
 * @param {Array[string]} columns array of the column(s) your need to get
 * @returns {object} data asked of the user by his username or email
 */
async function getFromUser(pool, id, columns) {
  try {
    const con = await pool.getConnection();
    if (columns.length <= 0) {
      throw new Error("getFromUser => Le tableau 'columns' est vide");
    }
    let sql = "SELECT ";
    columns.forEach((element) => {
      sql += `${element}, `;
    });
    sql = sql.slice(0, -2);
    sql += " FROM accounts WHERE username = ? OR email = ?;";
    const values = [id, id];
    const [rows] = await con.query(sql, values);

    if (columns.length === 1) {
      switch (columns[0]) {
        case "id":
          return rows[0]?.id;
        case "username":
          return rows[0]?.username;
        case "password":
          return rows[0]?.password;
        case "email":
          return rows[0]?.email;
        case "image":
          return rows[0]?.image;
        case "token":
          return rows[0]?.token;
        default:
          return rows[0];
      }
    }

    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get the password of an user from his username or email
 * @param {object} pool your pool connection
 * @param {string} id the username or email of the user
 * @returns {string} the password of the user or undefined
 */
async function getUserPassword(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql =
      "SELECT password FROM accounts WHERE username = ? OR email = ?;";
    const values = [id, id];

    const [rows] = await con.query(sql, values);

    return rows[0]?.password;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get the token of an user from his username or email
 * @param {object} pool your pool connection
 * @param {string} id the username or email of the user
 * @returns {string} the token of the user or undefined
 */
async function getUserToken(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT token FROM accounts WHERE username = ? OR email = ?;";
    const values = [id, id];

    const [rows] = await con.query(sql, values);

    return rows[0]?.token;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get selected data from all lists
 * @param {object} pool your pool connection 
 * @param {Array[string]} columns array of the column(s) your need to get
 * @returns {object} data asked from all lists
 */
async function getFromAllLists(pool, columns) {
  try {
    const con = await pool.getConnection();
    if (columns.length <= 0) {
      throw new Error("getFromAllLists => Le tableau 'columns' est vide");
    }
    let sql = "SELECT ";
    columns.forEach((element) => {
      sql += `${element}, `;
    });
    sql = sql.slice(0, -2);
    sql += " FROM list";
    const [rows] = await con.query(sql);

    return rows;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get selected datas from one list with his ID
 * @param {object} pool your pool connection 
 * @param {int} id your list ID
 * @param {Array[string]} columns array of the column(s) your need to get
 * @returns {object} data asked of the list by his ID 
 */
async function getFromList(pool, id, columns) {
  try {
    const con = await pool.getConnection();
    if (columns.length <= 0) {
      throw new Error("getFromList => Le tableau 'columns' est vide");
    }
    let sql = "SELECT ";
    columns.forEach((element) => {
      sql += `${element}, `;
    });
    sql = sql.slice(0, -2);
    sql += " FROM list WHERE id = ?;";
    const values = [id];
    const [rows] = await con.query(sql, values);

    if (columns.length === 1) {
      switch (columns[0]) {
        case "id":
          return rows[0]?.id;
        case "name":
          return rows[0]?.name;
        case "favorite":
          return rows[0]?.favorite;
        case "accountId":
          return rows[0]?.accountId;
        default:
          return rows[0];
      }
    }

    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

//----------------------------------INSERT----------------------------------\\

/**
 * Insert a new user into the database
 * @param {object} pool your pool connection
 * @param {string} username the username of your user
 * @param {string} email the email of your user
 * @param {string} password the password of your user
 * @returns {boolean} true if the user creation succeed
 */
async function createUser(pool, username, email, password) {
  try {
    const con = await pool.getConnection();
    const sql =
      "INSERT INTO accounts(username, password, email) VALUES(?, ?, ?)";
    const values = [username, password, email];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Insert a new list into the database
 * @param {object} pool your pool connection
 * @param {string} name your list name 
 * @param {boolean} isFavorite true if the list is a favorite games list
 * @param {int} account the account who had the list 
 * @returns {boolean} true if the list creation succeed
 */
async function createList(pool, name, isFavorite, account) {
  try {
    const con = await pool.getConnection();
    const sql = "INSERT INTO list(name, favorite, accountId) VALUES(?, ?, ?)";
    const values = [name, isFavorite, account];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

//----------------------------------UPDATE----------------------------------\\

/**
 * Updates selected datas into accounts
 * @param {object} pool your pool connection
 * @param {string} username the username of the user you want to update
 * @param {Array[string]} columns array of the column(s) your need to update
 * @param {Array[string]} values array of the value(s) you want to set
 * @returns
 */
async function updateAnUser(pool, username, columns, values) {
  try {
    const con = await pool.getConnection();
    if (columns.length <= 0 && values.length !== columns.length) {
      throw new Error(
        "getFromAccount => Le tableau 'columns' est vide ou le tableau 'values' n'as pas autant de valeurs que le tableau 'columns'",
      );
    }
    let sql = "UPDATE accounts SET ";

    for (let i = 0; i < columns.length; i++) {
      sql += `${columns[i]} = ?, `;
    }
    sql = sql.slice(0, -2);
    sql += " WHERE username = ?;";

    values.push(username);
    await con.query(sql, values);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Update the account to add a new token
 * @param {object} pool your pool connection
 * @param {string} username the user to add a login token
 * @param {string} token the token value
 * @returns {boolean} if the token was successfully added
 */
async function addToken(pool, username, token) {
  try {
    const con = await pool.getConnection();
    const sql = "UPDATE accounts SET token = ? WHERE username = ?;";
    const values = [token, username];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

//----------------------------------DELETE----------------------------------\\

/**
 * Delete an account from his username
 * @param {object} pool your pool connection
 * @param {string} username the user to delete
 * @returns {boolean} if the account was successfully deleted
 */
async function deleteUser(pool, username) {
  try {
    const con = await pool.getConnection();
    const sql = "DELETE FROM accounts WHERE username = ?;";
    const values = [username];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

//----------------------------------EXPORT----------------------------------\\

export default {
  dbConnect,
  dbConnectServer,
  dbInit,
  dbDisconnect,
  existUser,
  existEmail,
  getUserPassword,
  getUserToken,
  getFromAllUsers,
  getFromUser,
  getFromAllLists,
  getFromList,
  createUser,
  createList,
  addToken,
  updateAnUser,
  deleteUser,
};