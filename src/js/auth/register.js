import db from "../db.js";

/**
 * Function to register based on data from the request
 * @param {Request} req the request 
 * @param  {Object} pool the database connection
 * @param  {Object} headers the headers to be added to the response
 * @returns {Response} the response to the base request
 */
async function register(req, pool, headers) {
    // get data from the request
    const { username, email, password } = await req.json();

    // hash password
    const hashedpassword = await Bun.password.hash(password);

    const checkUsernameExist = await db.existUser(pool, username);
    const checkEmailExist = await db.existUser(pool, email);
    let userCreated;

    // check if user already exists
    if (!checkUsernameExist && !checkEmailExist) {
        userCreated = await db.createUser(pool, username, email, hashedpassword);
    } else {
        return new Response("User already exists", { status: 502, headers });
    }

    // generate and add a token to the user
    const secret = require('crypto').randomBytes(48).toString('hex');
    await db.addToken(pool, username, secret);

    // check if user creation succeeded
    if (userCreated) {
        return new Response("Success, please login now", { status: 200, headers });
    } else {
        return new Response("Error", { status: 500, headers });
    }
}

export default register;