import db from "../js/db";

/**
 * Update the username of an account in the database
 * @param {Request} req the request with credentials
 * @param {object} pool The pool connection
 * @returns {Response} the response if the user has logged in or not
 */
async function updateUsername(req, pool) {
    const { oldUsername, newUsername } = await req.json();

    const existUser = await db.existUser(pool, oldUsername);

    if (existUser) {
        db.updateUser(pool, oldUsername, ['username'], [newUsername]);
    } else {
        return new Response("User does not exist", { status: 502 });
    }

    return new Response("Success, username updated", { status: 200 });
}

/**
 * Delete an account with the username
 * @param {Request} req the request with credentials
 * @param {object} pool The pool connection
 * @returns {Response} the response if the user has logged in or not
 */
async function deleteAccount(req, pool) {
    const { username } = await req.json();

    const existUser = await db.existUser(pool, username);

    if (existUser) {
        db.deleteUser(pool, username);
    } else {
        return new Response("User does not exist", { status: 502 });
    }
    return new Response("Success, account deleted", { status: 200 });
}

/**
 * Update th euser Image of profile
 * @param {Request} req the request with credentials
 * @param {object} pool The pool connection
 * @returns {Response} the response if the user has logged in or not
 */
async function updateImage(req, pool) {
    const { username, file } = await req.json()
    const existUser = await db.existUser(pool, username);
    // TODO add compresseur d'image because insert fail when file too big

    if (existUser) {
        const fileJSON = JSON.stringify(file);
        db.updateUser(pool, username, ['image'], [fileJSON]);
    } else {
        return new Response("User does not exist", { status: 502 });
    }
    return new Response("Success, account deleted", { status: 200 });
}

/**
 * Get the user profile image
 * @param {object} pool The pool connection
 * @returns {Response} the response if the user has logged in or not
 */
async function getUserImage(pool, url) {
    try {
        const urlsearchParams = url.searchParams;
        const params = {};
        for (const [key, value] of urlsearchParams) {
            params[key] = value;
        }

        const username = params.username;
        const existUser = await db.existUser(pool, username);

        if (existUser) {
            const image = await db.getFromUser(pool, username, ['image']);
            const response = new Response(JSON.stringify(image), { status: 200 });
            return response;
        } else {
            return new Response("User does not exist", { status: 502 });
        }
    } catch (error) {
        return new Response(`An error occured : ${error}`, { status: 500 });
    }

}

export default {
    getUserImage,
    updateUsername,
    updateImage,
    deleteAccount,
};