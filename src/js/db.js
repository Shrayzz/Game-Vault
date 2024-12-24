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
    "CREATE TABLE IF NOT EXISTS accounts (id int(11) NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL UNIQUE, password varchar(255) NOT NULL, email varchar(100) NOT NULL UNIQUE, image json, token varchar(96) UNIQUE, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
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
 * Check if an account Email exist
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

/**
 * Get all games data
 * @param {object} pool your pool connection 
 * @returns {object} data of the games
 */
async function getAllGames(pool) {
  try {
    const con = await pool.getConnection();
    const sql =
      "SELECT id, source FROM game;";

    const [rows] = await con.query(sql);

    return rows;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get data of a game with his ID
 * @param {object} pool your pool connection  
 * @param {int} id the ID of the game 
 * @returns {object} the data of the game of the ID
 */
async function getGame(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT id, source FROM game WHERE id = ?;";
    const values = [id];

    const [rows] = await con.query(sql, values);

    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get all games that are in a list identified by his ID
 * @param {object} pool your pool connection  
 * @param {int} listId the ID of the list
 * @returns {object} the games in the list
 */
async function getGamesFromList(pool, listId) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT game.id AS idGame, source FROM listhasgames INNER JOIN game ON listhasgames.idGame = game.id WHERE idList = ?;";
    const values = [listId];

    const [rows] = await con.query(sql, values);

    return rows;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get all Lists where is a game identified by his ID
 * @param {object} pool your pool connection 
 * @param {int} gameId the ID of the game 
 * @returns {object} the lists where is the game
 */
async function getGameList(pool, gameId) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT id AS idList, name, favorite, accountId FROM listhasgames INNER JOIN list ON listhasgames.idList = list.id WHERE idGame = ?;";
    const values = [gameId];

    const [rows] = await con.query(sql, values);

    return rows;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get all categories
 * @param {object} pool your pool connection 
 * @returns {object} all categories
 */
async function getAllCategories(pool) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT id, name FROM category;";

    const [rows] = await con.query(sql);

    return rows;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get a category by his ID
 * @param {object} pool your pool connection 
 * @param {int} id your category ID
 * @returns {object} the category data
 */
async function getCategory(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT id, name FROM category WHERE id = ?;";
    const values = [id];

    const [rows] = await con.query(sql, values);

    return rows[0];
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get all games from a category
 * @param {object} pool your pool connection
 * @param {int} categoryId the ID of the category
 * @returns {object} All games from a category by his ID
 */
async function getGamesFromCategory(pool, categoryId) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT game.id AS idGame, source FROM gamehascategory INNER JOIN game ON gamehascategory.idGame = game.id WHERE idCategory = ?;";
    const values = [categoryId];

    const [rows] = await con.query(sql, values);

    return rows;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Get categories of a game by his ID
 * @param {object} pool your pool connection
 * @param {int} gameId your game ID
 * @returns {object} the categories of a game
 */
async function getGameCategories(pool, gameId) {
  try {
    const con = await pool.getConnection();
    const sql = "SELECT id AS idCategory, name FROM gamehascategory INNER JOIN category ON gamehascategory.idCategory = category.id WHERE idGame = ?;";
    const values = [gameId];

    const [rows] = await con.query(sql, values);

    return rows;
  } catch (err) {
    console.log(err);
  }
}

/**
 * get user lists
 * @param {object} pool your pool connection
 * @param {string} username the username
 * @param {boolean | null} favorite true if favorite else false | null to get all
 * @returns the lists of the user
 */
async function getUserLists(pool, username, favorite = null) {
  try {
    const con = await pool.getConnection();
    let sql = "SELECT list.id, list.name, list.favorite, list.accountId FROM list INNER JOIN accounts ON list.accountId = accounts.id WHERE accounts.username = ?";
    let values = [username];

    if (favorite !== null) {
      if (favorite) {
        values.push(1);
      } else {
        values.push(0);
      }
      sql += " AND favorite = ?";
    }
    sql += ";";

    const [rows] = await con.query(sql, values);

    return rows;
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

/**
 * Create a new game
 * @param {object} pool your pool connection 
 * @param {string} source the source of the new game 
 * @returns  {boolean} true if the game creation succeed
 */
async function createGame(pool, source) {
  try {
    const con = await pool.getConnection();
    const sql = "INSERT INTO game(source) VALUES(?)";
    const values = [source];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Add a game into a list both identified with their ID
 * @param {object} pool your pool connection 
 * @param {int} listId the ID of the list 
 * @param {int} gameId the ID of the game 
 * @returns {boolean} true if the creation succeed
 */
async function addGameToList(pool, listId, gameId) {
  try {
    const con = await pool.getConnection();
    const sql = "INSERT INTO listhasgames(idList, idGame) VALUES(?, ?)";
    const values = [listId, gameId];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Create a new category
 * @param {object} pool your pool connection
 * @param {string} name the name of your category
 * @returns {boolean} true if the creation succeed
 */
async function createCategory(pool, name) {
  try {
    const con = await pool.getConnection();
    const sql = "INSERT INTO category(name) VALUES(?)";
    const values = [name];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Add a category to a game both identified with their ID
 * @param {object} pool your pool connection
 * @param {int} gameId your game ID
 * @param {int} categoryId your category ID
 * @returns {boolean} true if the creation succeed
 */
async function addGameToCategory(pool, gameId, categoryId) {
  try {
    const con = await pool.getConnection();
    const sql = "INSERT INTO gamehascategory(idGame, idCategory) VALUES(?, ?)";
    const values = [gameId, categoryId];

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
 * @returns  {boolean} true if the user update succeed
 */
async function updateUser(pool, username, columns, values) {
  try {
    const con = await pool.getConnection();
    if (columns.length <= 0 && values.length !== columns.length) {
      throw new Error(
        "updateUser => Le tableau 'columns' est vide ou le tableau 'values' n'as pas autant de valeurs que le tableau 'columns'",
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
 * @returns {boolean} if the token was successfully modified
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

/**
 * Updates selected datas into list
 * @param {object} pool your pool connection
 * @param {string} id the ID of the list you want to update
 * @param {Array[string]} columns array of the column(s) your need to update
 * @param {Array[mixed]} values array of the value(s) you want to set
 * @returns{boolean} if the list was successfully modified
 */
async function updateList(pool, id, columns, values) {
  try {
    const con = await pool.getConnection();
    if (columns.length <= 0 && values.length !== columns.length) {
      throw new Error(
        "updateList => Le tableau 'columns' est vide ou le tableau 'values' n'as pas autant de valeurs que le tableau 'columns'",
      );
    }
    let sql = "UPDATE list SET ";

    for (let i = 0; i < columns.length; i++) {
      sql += `${columns[i]} = ?, `;
    }
    sql = sql.slice(0, -2);
    sql += " WHERE id = ?;";

    values.push(id);
    await con.query(sql, values);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Update a game with his ID
 * @param {object} pool your pool connection
 * @param {int} id the ID of the game
 * @param {string} source the new source of the game
 * @returns {boolean} true if the game was successfully modified
 */
async function updateGame(pool, id, source) {
  try {
    const con = await pool.getConnection();
    const sql = "UPDATE game SET source = ? WHERE id = ?;";
    const values = [source, id];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * update a category by his ID
 * @param {object} pool your pool connection
 * @param {int} id your category ID
 * @param {string} name your new category name
 * @returns {boolean} true if the game was successfully modified
 */
async function updateCategory(pool, id, name) {
  try {
    const con = await pool.getConnection();
    const sql = "UPDATE category SET name = ? WHERE id = ?;";
    const values = [name, id];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Modify the Account token to set it to NULL
 * @param {object} pool your pool connection
 * @param {string} username the username of the account
 * @returns {boolean} true if the token was successfully modified
 */
async function deleteUserToken(pool, username) {
  try {
    const con = await pool.getConnection();
    const sql = "UPDATE accounts SET token = NULL WHERE username = ?;";
    const values = [username];

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
 * @returns {boolean} true if the account was successfully deleted
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

/**
 * Delete a list with his ID
 * @param {object} pool your pool connection 
 * @param {int} id the ID of the list 
 * @returns {boolean} true if the list was successfully deleted
 */
async function deleteList(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql = "DELETE FROM list WHERE id = ?;";
    const values = [id];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Delete a game with his ID
 * @param {object} pool your pool connection
 * @param {int} id teh ID of the game
 * @returns {boolean} true if the game was successfully deleted
 */
async function deleteGame(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql = "DELETE FROM game WHERE id = ?;";
    const values = [id];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Delete a game from a list both identified whith their ID
 * @param {object} pool your pool connection 
 * @param {int} listId your list ID
 * @param {int} gameId your game ID
 * @returns {boolean} true if the game was successfully removed from the list
 */
async function deleteGameFromList(pool, listId, gameId) {
  try {
    const con = await pool.getConnection();
    const sql = "DELETE FROM listhasgames WHERE idList = ? AND idGame = ?;";
    const values = [listId, gameId];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Delete a category by his ID
 * @param {object} pool your pool connection
 * @param {int} id the category ID
 * @returns {boolean} true if the category was successfully deleted
 */
async function deleteCategory(pool, id) {
  try {
    const con = await pool.getConnection();
    const sql = "DELETE FROM category WHERE id = ?;";
    const values = [id];

    await con.query(sql, values);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Delete a category from a game both identified whith their ID 
 * @param {object} pool your pool connection
 * @param {int} gameId your game ID
 * @param {int} categoryId your category ID
 * @returns {boolean} true if the category was successfully deleted from teh game
 */
async function deleteGameCategory(pool, gameId, categoryId) {
  try {
    const con = await pool.getConnection();
    const sql = "DELETE FROM gamehascategory WHERE idGame = ? AND idCategory = ?;";
    const values = [gameId, categoryId];

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
  getAllGames,
  getGame,
  getGamesFromList,
  getGameList,
  getAllCategories,
  getCategory,
  getGamesFromCategory,
  getGameCategories,
  getUserLists,
  createUser,
  createList,
  createGame,
  createCategory,
  addToken,
  addGameToList,
  addGameToCategory,
  deleteUserToken,
  updateUser,
  updateList,
  updateGame,
  updateCategory,
  deleteUser,
  deleteList,
  deleteGame,
  deleteGameFromList,
  deleteCategory,
  deleteGameCategory,
};