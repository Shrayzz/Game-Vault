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

    return new Response("Success, please login now", { status: 200 });
}

export default {
    updateUsername,
};