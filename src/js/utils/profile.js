import db from "../db";

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

async function updateImage(req, pool) {
    const { username, file } = await req.json()
    const existUser = await db.existUser(pool, username);
    // TODO add compresseur d'image because insert fail when file too big

    if (existUser) {
        db.updateUser(pool, username, ['image'], [file]);
    } else {
        return new Response("User does not exist", { status: 502 });
    }
    return new Response("Success, account deleted", { status: 200 });
}

export default {
    updateUsername,
    updateImage,
    deleteAccount,
};