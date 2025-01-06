import db from "../db";

/**
 * Add a new list
 * @param {Request} req the request with credentials
 * @param {object} pool the pool connection
 * @returns {Response} the response of the list add
 */
async function addList(req, pool) {
    try {
        const { username, listName } = await req.json();
        const existUser = await db.existUser(pool, username);

        if (existUser) {
            const userId = await db.getFromUser(pool, username, ['id']);
            await db.createList(pool, listName, false, userId);
            return new Response("List successfuly created", { status: 200 });
        } else {
            return new Response("User does not exist", { status: 502 });
        }
    } catch (error) {
        return new Response(`An error occured : ${error}`, { status: 500 });
    }
}

/**
 * Get all lists of an user
 * @param {object} pool The pool connection
 * @param {URL} url the current url
 * @returns {Response} the response
 */
async function getUserLists(pool, url) {
    try {
        const urlsearchParams = url.searchParams;
        const params = {};
        for (const [key, value] of urlsearchParams) {
            params[key] = value;
        }

        const username = params.username;
        const existUser = await db.existUser(pool, username);

        if (existUser) {
            const lists = await db.getUserLists(pool, username);
            const response = new Response(JSON.stringify(lists), { status: 200 });
            return response;
        } else {
            return new Response(JSON.stringify("User does not exist"), { status: 502 });
        }
    } catch (error) {
        return new Response(JSON.stringify(`An error occured : ${error}`), { status: 500 });
    }
}

/**
 * add game to favorite user list
 * @param {object} pool the pool connection
 * @param {Request} req the request with credentials
 * @returns {Response} the response
 */
async function addGameToFavorite(pool, req) {
    try {
        const { username, gameId } = await req.json();
        const existUser = await db.existUser(pool, username);

        if (existUser) {
            const existGame = await db.getGame(pool, gameId);

            if (existGame.length >= 0) {
                try {
                    await db.createGame(pool, gameId, 'steam');
                } catch (error) {
                    return new Response(`An error occured while creating a game : ${error}`, { status: 500 });
                }
            }

            const favoriteList = await db.getUserLists(pool, username, true);
            await db.addGameToList(pool, favoriteList.id, gameId);
            return new Response("List successfuly created", { status: 200 });
        } else {
            return new Response("User does not exist", { status: 502 });
        }
    } catch (error) {
        return new Response(`An error occured : ${error}`, { status: 500 });
    }
}

export default {
    getUserLists,
    addList,
    addGameToFavorite,
}