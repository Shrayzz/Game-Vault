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
            const game = await db.getGame(pool, gameId);

            if (game?.length <= 0 || game === undefined) {
                try {
                    await db.createGame(pool, gameId, 'steam');
                } catch (error) {
                    return new Response(`An error occured while creating a game : ${error}`, { status: 500 });
                }
            }

            let favoriteList = await db.getUserLists(pool, username, true);

            if (favoriteList?.length <= 0 || favoriteList === undefined) {
                try {
                    const userId = await db.getFromUser(pool, username, ['id']);
                    await db.createList(pool, 'favorite', true, userId);
                    favoriteList = await db.getUserLists(pool, username, true);
                } catch (error) {
                    return new Response(`An error occured while creating a favorite list : ${error}`, { status: 500 });
                }
            }

            const isGameInFavorite = await db.existGameInList(pool, gameId, favoriteList[0].id);
            if (isGameInFavorite) {
                return new Response(`Game is already in favorite list`, { status: 302 });
            }

            await db.addGameToList(pool, favoriteList[0].id, gameId);
            return new Response("Game successfuly added", { status: 200 });
        } else {
            return new Response("User does not exist", { status: 502 });
        }
    } catch (error) {
        return new Response(`An error occured : ${error}`, { status: 500 });
    }
}

/**
 * Get all games in the user favorite list
 * @param {object} pool the pool connection
 * @param {Request} req the request with credentials
 * @returns {Response} the response
 */
async function getUserFavoriteGames(pool, url) {
    try {
        const urlsearchParams = url.searchParams;
        const params = {};
        for (const [key, value] of urlsearchParams) {
            params[key] = value;
        }

        const username = params.username;
        const existUser = await db.existUser(pool, username);

        if (!existUser) {
            return new Response("User does not exist", { status: 502 });
        }

        let favoriteList = await db.getUserLists(pool, username, true);

        if (favoriteList?.length <= 0 || favoriteList === undefined) {
            try {
                const userId = await db.getFromUser(pool, username, ['id']);
                await db.createList(pool, 'favorite', true, userId);
                favoriteList = await db.getUserLists(pool, username, true);
            } catch (error) {
                return new Response(`An error occured while creating a favorite list : ${error}`, { status: 500 });
            }
        }
        favoriteList = favoriteList[0];

        const favoriteGames = await db.getGamesFromList(pool, favoriteList.id);

        let favoriteGamesTab = [];
        for (let i = 0; i < favoriteGames.length; i++) {
            let dbGame = await db.getGame(pool, favoriteGames[i].idGame);
            if (dbGame.source === "steam") {
                const fullGameJSON = await fetch(`http://localhost:3000/api/steam/appdetail?appid=${dbGame.id}`, {
                    method: "GET",
                });
                const fullGame = await fullGameJSON.json();
                favoriteGamesTab.push({ id: favoriteGames[i].idGame, gameInfo: fullGame });
            } else {
                return new Response(`An error occured while getting games : Can't find source`, { status: 500 });
            }
        }

        return new Response(JSON.stringify(favoriteGamesTab), { status: 200 });

    } catch (error) {
        return new Response(`An error occured : ${error}`, { status: 500 });
    }
}

export default {
    getUserLists,
    addList,
    addGameToFavorite,
    getUserFavoriteGames,
}