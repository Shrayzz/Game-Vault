import test from 'ava';
import db from '../src/js/db.js';

test.before(async () => {
    //Create test Database
    const servPool = await db.dbConnectServer("localhost", "root", "root");
    const serv = await servPool.getConnection();

    const SimpleGameLibraryTestDatabase = "CREATE DATABASE IF NOT EXISTS SimpleGameLibraryTest;";

    await serv.query(SimpleGameLibraryTestDatabase);

    await db.dbDisconnect(servPool);

    //Create Tables in test Database
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );
    const con = await pool.getConnection();

    const accountsTable = "CREATE TABLE IF NOT EXISTS accounts (id int(11) NOT NULL AUTO_INCREMENT, username varchar(50) NOT NULL UNIQUE, password varchar(255) NOT NULL, email varchar(100) NOT NULL UNIQUE, image blob NULL, token varchar(96) UNIQUE, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const listTable = "CREATE TABLE IF NOT EXISTS list (id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, favorite boolean DEFAULT false, accountId int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (accountID) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const gameTable = "CREATE TABLE IF NOT EXISTS game(id int(11) NOT NULL AUTO_INCREMENT, source varchar(255) NOT NULL, PRIMARY KEY (id));";
    const categoryTable = "CREATE TABLE IF NOT EXISTS category(id int(11) NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const listHasGameTable = "CREATE TABLE IF NOT EXISTS listHasGames(idList int(11) NOT NULL, idGame int(11) NOT NULL, PRIMARY KEY (idList, idGame), FOREIGN KEY (idList) REFERENCES list (id), FOREIGN KEY (idGame) REFERENCES game (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const gameHasCategory = "CREATE TABLE IF NOT EXISTS gameHasCategory(idGame int(11) NOT NULL, idCategory int(11) NOT NULL, PRIMARY KEY (idGame, idCategory), FOREIGN KEY (idGame) REFERENCES game (id), FOREIGN KEY (idCategory) REFERENCES category (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";
    const api_token = "CREATE TABLE IF NOT EXISTS api_token(accountId int(11) NOT NULL, token varchar(255) NOT NULL, api_provider varchar(50) NOT NULL, exp_date timestamp, PRIMARY KEY (accountId, token), FOREIGN KEY (accountid) REFERENCES accounts (id)) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;"

    await con.query(accountsTable);
    await con.query(listTable);
    await con.query(gameTable);
    await con.query(categoryTable);
    await con.query(listHasGameTable);
    await con.query(gameHasCategory);
    await con.query(api_token);

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
    const accountsTableData = "INSERT INTO accounts (username, password, email, token) VALUES('test1', 'test', 'test@email.com', 'token1'), ('test2', 'ABCDE', 'LeTest@email.fr', NULL), ('test3', 'AZERTY', 'jesuisuntest@email.com', NULL), ('testUpdate', 'azeqsdwxc', 'updateTest@email.de', NULL), ('testDelete', 'deletein2seconds', 'help@email.del', NULL);";
    const listTableData = "INSERT INTO list (name, favorite, accountId) VALUES('testList1', 0, 1), ('testList2', 1, 1), ('testUpdateList', 0, 2), ('testDeleteList', 0, 1);";
    const gameTableData = "INSERT INTO game (source) VALUES('source1'), ('source2'), ('source3'), ('testUpdateSource'), ('testDeleteSource');";
    const categoryTableData = "INSERT INTO category (name) VALUES('testCategory1'), ('testCategory2'), ('testCategory3'), ('testUpdateCategory'), ('testDeleteCategory');";
    const listHasGameTableData = "INSERT INTO listHasGames (idList, idGame) VALUES(1, 1), (1, 2), (2, 2), (2, 3);";
    const gameHasCategoryData = "INSERT INTO gameHasCategory (idGame, idCategory) VALUES(1, 1), (1, 2), (2, 1), (2, 3), (3, 3);";

    await con.query(accountsTableData);
    await con.query(listTableData);
    await con.query(gameTableData);
    await con.query(categoryTableData);
    await con.query(listHasGameTableData);
    await con.query(gameHasCategoryData);

    await db.dbDisconnect(pool);
});

test('test existUser', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.existUser(pool, "test2"));
    t.true(await db.existUser(pool, "jesuisuntest@email.com"));
    t.false(await db.existUser(pool, "badNameOrEmail"));

    db.dbDisconnect(pool);
});

test('test existEmail', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.existEmail(pool, "LeTest@email.fr"));
    t.false(await db.existEmail(pool, "BadEmail"));

    db.dbDisconnect(pool);
});

test('test getFromAllUsers', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getFromAllUsers(pool, ['username', 'password']);

    t.is(data[0]?.username, 'test1');
    t.is(data[0]?.password, 'test');
    t.is(data[1]?.username, 'test2');
    t.is(data[1]?.password, 'ABCDE');
    t.is(data[2]?.username, 'test3');
    t.is(data[2]?.password, 'AZERTY');

    db.dbDisconnect(pool);
});

test('test getFromUser', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getFromUser(pool, 'test1', ['id', 'email']);

    t.is(data.id, 1);
    t.is(data.email, 'test@email.com');

    t.is(await db.getFromUser(pool, 'test2', ['id']), 2);
    t.is(await db.getFromUser(pool, 'test2', ['username']), 'test2');
    t.is(await db.getFromUser(pool, 'test2', ['password']), 'ABCDE');
    t.is(await db.getFromUser(pool, 'test2', ['email']), 'LeTest@email.fr');
    t.is(await db.getFromUser(pool, 'test1', ['image']), null)

    db.dbDisconnect(pool);
});

test('test getUserPassword', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.is(await db.getUserPassword(pool, "test2"), "ABCDE");
    t.is(await db.getUserPassword(pool, "badNameOrEmail"), undefined);

    db.dbDisconnect(pool);
});

test('test createUser', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.createUser(pool, "insertTestUser", "insert@test.testing", "insertTestPWD"));
    t.true(await db.existUser(pool, "insertTestUser"));

    db.dbDisconnect(pool);
});

test('test updateUser', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    await db.updateUser(pool, 'testUpdate', ['username', 'password', 'email'], ['updatedTest', 'aNewPwd', 'updated@mail.fr']);
    const data = await db.getFromUser(pool, 'updatedTest', ['username', 'password', 'email']);

    t.is(data?.username, 'updatedTest');
    t.is(data?.password, 'aNewPwd');
    t.is(data?.email, 'updated@mail.fr');

    db.dbDisconnect(pool);
});

test('test deleteUser', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.deleteUser(pool, 'testDelete'));
    t.false(await db.existUser(pool, 'testDelete'));

    db.dbDisconnect(pool);
});

test('test getUserToken', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.is(await db.getUserToken(pool, 'test1'), 'token1')

    db.dbDisconnect(pool);
});

test('test addToken', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.addToken(pool, 'test2', 'tokenUpdate'));
    t.is(await db.getUserToken(pool, 'test2'), 'tokenUpdate')

    db.dbDisconnect(pool);
});

test('test getFromAllLists', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getFromAllLists(pool, ['id', 'name', 'accountId']);

    t.is(data[0]?.id, 1);
    t.is(data[0]?.name, 'testList1');
    t.is(data[0]?.accountId, 1);
    t.is(data[1]?.id, 2);
    t.is(data[1]?.name, 'testList2');
    t.is(data[1]?.accountId, 1);

    db.dbDisconnect(pool);
});

test('test getFromList', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getFromList(pool, 1, ['id', 'name', 'accountId']);

    t.is(data?.id, 1);;
    t.is(data?.name, 'testList1');
    t.is(data?.accountId, 1);

    t.is(await db.getFromList(pool, 2, ['id']), 2);
    t.is(await db.getFromList(pool, 2, ['name']), 'testList2');
    t.is(await db.getFromList(pool, 2, ['favorite']), 1);
    t.is(await db.getFromList(pool, 2, ['accountId']), 1);

    db.dbDisconnect(pool);
});

test('test createList', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    await db.createList(pool, 'insertListTest', true, 2);
    t.is(await db.getFromList(pool, 5, ['name']), 'insertListTest');

    db.dbDisconnect(pool);
});

test('test updateList', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    await db.updateList(pool, 3, ['name', 'favorite'], ['updatedList', 1]);
    const data = await db.getFromList(pool, 3, ['name', 'favorite']);

    t.is(data?.name, 'updatedList');
    t.is(data?.favorite, 1);

    db.dbDisconnect(pool);
});

test('test deleteList', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.deleteList(pool, 4));
    t.is(await db.getFromList(pool, 4, ['name']), undefined);

    db.dbDisconnect(pool);
});

test('test getAllGames', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getAllGames(pool);

    t.is(data[0]?.id, 1);
    t.is(data[0]?.source, 'source1')
    t.is(data[1]?.id, 2);
    t.is(data[1]?.source, 'source2')
    t.is(data[2]?.id, 3);
    t.is(data[2]?.source, 'source3')

    db.dbDisconnect(pool);
});

test('test getGame', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getGame(pool, 1);

    t.is(data?.id, 1);
    t.is(data?.source, 'source1');

    db.dbDisconnect(pool);
});

test('test createGame', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.createGame(pool, 'createdSource'));

    const data = await db.getGame(pool, 6);

    t.is(data?.source, 'createdSource');

    db.dbDisconnect(pool);
});

test('test updateGame', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.updateGame(pool, 4, 'updatedSource'));

    const data = await db.getGame(pool, 4);

    t.is(data?.source, 'updatedSource');

    db.dbDisconnect(pool);
});

test('test deleteGame', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.deleteGame(pool, 5));

    const data = await db.getGame(pool, 5);

    t.is(data, undefined);

    db.dbDisconnect(pool);
});

test('test getGamesFromList', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getGamesFromList(pool, 1);

    t.is(data[0]?.idGame, 1);
    t.is(data[0]?.source, 'source1');
    t.is(data[1]?.idGame, 2);
    t.is(data[1]?.source, 'source2');

    db.dbDisconnect(pool);
});

test('test getGameList', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getGameList(pool, 2);

    t.is(data[0]?.idList, 1);
    t.is(data[0]?.name, 'testList1');
    t.is(data[0]?.favorite, 0);
    t.is(data[0]?.accountId, 1);
    t.is(data[1]?.idList, 2);
    t.is(data[1]?.name, 'testList2');
    t.is(data[1]?.favorite, 1);
    t.is(data[1]?.accountId, 1);

    db.dbDisconnect(pool);
});

test('test addGameToList', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.addGameToList(pool, 2, 1));

    const data = await db.getGamesFromList(pool, 2);

    t.is(data[0]?.idGame, 1);

    db.dbDisconnect(pool);
});

test('test deleteGameFromList', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.deleteGameFromList(pool, 2, 3));

    const data = await db.getGamesFromList(pool, 2);

    t.not(data[2]?.idGame, 3);
    t.not(data[2]?.source, 'source3');

    db.dbDisconnect(pool);
})

test('test getAllCategory', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getAllCategories(pool);

    t.is(data[0].id, 1);
    t.is(data[0].name, 'testCategory1');
    t.is(data[1].id, 2);
    t.is(data[1].name, 'testCategory2');
    t.is(data[2].id, 3);
    t.is(data[2].name, 'testCategory3');

    db.dbDisconnect(pool);
})

test('test getCategory', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getCategory(pool, 2);

    t.is(data?.id, 2);
    t.is(data?.name, 'testCategory2');

    db.dbDisconnect(pool);
})

test('test createCategory', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.createCategory(pool, 'createdCategory'));

    const data = await db.getCategory(pool, 6);

    t.is(data.name, 'createdCategory');

    db.dbDisconnect(pool);
})

test('test updateCategory', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.updateCategory(pool, 4, 'updatedCategory'));

    const data = await db.getCategory(pool, 4);

    t.is(data.name, 'updatedCategory');

    db.dbDisconnect(pool);
})

test('test deleteCategory', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.deleteCategory(pool, 5));

    const data = await db.getCategory(pool, 5);

    t.is(data, undefined);

    db.dbDisconnect(pool);
})

test('test getGamesFromCategory', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getGamesFromCategory(pool, 1);

    t.is(data[0].idGame, 1);
    t.is(data[0].source, 'source1');
    t.is(data[1].idGame, 2);
    t.is(data[1].source, 'source2');

    db.dbDisconnect(pool);
})

test('test getGameCategories', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    const data = await db.getGameCategories(pool, 1);

    t.is(data[0].idCategory, 1);
    t.is(data[0].name, 'testCategory1');
    t.is(data[1].idCategory, 2);
    t.is(data[1].name, 'testCategory2');

    db.dbDisconnect(pool);
})

test('test addGameToCategory', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.addGameToCategory(pool, 2, 2));

    const data = await db.getGameCategories(pool, 2);

    t.is(data[1].name, 'testCategory2')

    db.dbDisconnect(pool);
})

test('test deleteGameCategory', async (t) => {
    const pool = await db.dbConnect(
        "localhost",
        "root",
        "root",
        "simplegamelibrarytest",
    );

    t.true(await db.deleteGameCategory(pool, 3, 3));

    const data = await db.getGameCategories(pool, 3);

    t.is(data[0], undefined)

    db.dbDisconnect(pool);
})