import db from "../js/db"
import jwt from "jsonwebtoken";

/**
 * Function login an users based on credentiels given
 * @param {Request} req the request with credentials
 * @returns {Response} the response if the user has logged in or not
 */
async function auth(req) {
    const { username, password } = req.body;

    // check for credentials if they exists or not
    const usernameExist = await db.checkAuth(username); //TODO: edit based on db functions
    const passwordExist = await Bun.password.verify(password, await db.getPassword(username)); //TODO: edit based on db functions

    // return error if credentials are invalid
    if (!usernameExist || !passwordExist) {
        return new Response("Invalid Credentials !", { status: 401 });
    }

    // generate a secret key, TO BE CHANGED like store the key associated to the user when connected in DB
    const secret = require('crypto').randomBytes(48).toString('hex'); console.log(token); // check if it work
    const addToken = await db.addToken(con, username, token);
    console.log(addToken);

    // create the payload
    const payload = {
        username: username,
        password: password
    };

    // create the token
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return new Response({ msg: "User logged in !", token: token });

}

/**
 * Function that will check if the user is logged in or not
 * @param {Request} req the request
 * @returns {Response} the response if the user is logged in or not
 */
async function checkAuth(req) {
    const token = req.headers.authorization.split(' ')[1]; // Authorization header

}