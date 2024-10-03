import db from "../js/db.js";

/**
 * Function to register based on data from the request
 * @param {Request} req the request 
 * @param  {Object} con the database connection
 * @returns {Response} the response to the base request
 */
async function register(req, con) {
    // get data from the resquest
    const { username, email, password } = await req.json();

    // hash password
    const hashedpassword = await Bun.password.hash(password);

    const checkUsernameExist = await db.existUser(con, username);
    const checkEmailExist = await db.existUser(con, email);
    let userCreated;

    // check if user already exist
    if (!checkUsernameExist && !checkEmailExist) {
        userCreated = await db.createUser(con, username, email, hashedpassword);
    } else {
        return new Response("User already exist", { status: 502 });
    }

    // generate and add a token to the user
    const secret = require('crypto').randomBytes(48).toString('hex');
    await db.addToken(con, username, secret);

    // check if user creation succeed
    if (userCreated) {
        return new Response("Succes, please login now", { status: 200 });
    }
    else {
        return new Response("Error", { status: 500 });
    }
}

export default register;