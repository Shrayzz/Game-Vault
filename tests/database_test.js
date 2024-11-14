import test from 'ava';
import db from '../src/js/db.js';

test.beforeEach(async (t) => {
    //Create test Database
    const serv = await db.dbConnectServer("localhost", "root", "root");

    const SimpleGameLibraryTestDatabase = "CREATE DATABASE IF NOT EXISTS SimpleGameLibraryTest;";

    await serv.query(SimpleGameLibraryTestDatabase);

    await db.dbDisconnect(serv);

    //Create Tables in test Database
    const con = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const accountsTable = "CREATE TABLE IF NOT EXISTS accounts (id int(11) NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL UNIQUE, password varchar(255) NOT NULL, email varchar(100) NOT NULL UNIQUE, image blob NULL, token varchar(96) UNIQUE, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const listTable = "CREATE TABLE IF NOT EXISTS list (id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, favorite boolean DEFAULT false, accountId int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (accountID) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const gameTable = "CREATE TABLE IF NOT EXISTS game(id int(11) NOT NULL AUTO_INCREMENT, source varchar(255) NOT NULL, PRIMARY KEY (id));";
    const categoryTable = "CREATE TABLE IF NOT EXISTS category(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const listHasGameTable = "CREATE TABLE IF NOT EXISTS listHasGames(idList int(11) NOT NULL, idGame int(11) NOT NULL, PRIMARY KEY (idList, idGame), FOREIGN KEY (idList) REFERENCES list (id), FOREIGN KEY (idGame) REFERENCES game (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const gameHasCategory = "CREATE TABLE IF NOT EXISTS gameHasCategory(idGame int(11) NOT NULL, idCategory int(11) NOT NULL, PRIMARY KEY (idGame, idCategory), FOREIGN KEY (idGame) REFERENCES game (id), FOREIGN KEY (idCategory) REFERENCES category (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";

    con.query(accountsTable);
    con.query(listTable);
    con.query(gameTable);
    con.query(categoryTable);
    con.query(listHasGameTable);
    con.query(gameHasCategory);

    // Drop all datas in the test database
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

    //Insert data in test Database
    const accountsTableData = "INSERT INTO accounts (username, password, email) VALUES('test1', 'test', 'test@email.com'), ('test2', 'ABCDE', 'LeTest@email.fr'), ('test3', 'AZERTY', 'jesuisuntest@email.com');";
    const listTableData = "INSERT INTO list (name, favorite, accountId) VALUES('testList1', 0, 1), ('testList2', 1, 1);";
    const gameTableData = "INSERT INTO game (source) VALUES('source1'), ('source2'), ('source3');";
    const categoryTableData = "INSERT INTO category (name) VALUES('testCategory1'), ('testCategory2'), ('testCategory3');";
    const listHasGameTableData = "INSERT INTO listHasGames (idList, idGame) VALUES(1, 1), (1, 2), (2, 2), (2, 3);";
    const gameHasCategoryData = "INSERT INTO gameHasCategory (idGame, idCategory) VALUES(1, 1), (1, 2), (2, 3), (3, 1), (3, 2), (3, 3);";

    con.query(accountsTableData);
    con.query(listTableData);
    con.query(gameTableData);
    con.query(categoryTableData);
    con.query(listHasGameTableData);
    con.query(gameHasCategoryData);

    await db.dbDisconnect(con);
});

test('mon test qui passe', t => {
    t.pass();
});

test.todo('test existUser');

test.todo('test existEmail');

test.todo('test getFromAllUsers');

test.todo('test getFromUser');

test.todo('test getUserPassword');

test.todo('test getUserToken');

test.todo('test createUser');

test.todo('test updateAnUser');

test.todo('test addToken');

test.todo('test updateUserImage');

test.todo('test updateUserPassword');

test.todo('test deleteUser');