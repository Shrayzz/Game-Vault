import db from "../js/db"
import jwt from "jsonwebtoken";

/**
 * Function login an users based on credentiels given
 * @param {Request} req the request with credentials
 * @returns {Response} the response if the user has logged in or not
 */
async function auth(req, con) {
    const { username, password } = await req.json();

    console.log(await req.json());

    // check for credentials if they exists or not
    const usernameExist = await db.existUser(con, username);

    const passwordExist = await Bun.password.verify(password, await db.getUserPassword(con, username));

    // return error if credentials are invalid
    if (!usernameExist || !passwordExist) {
        return new Response("Invalid Credentials !", { status: 401 });
    }

    // generate the token and add it to db
    const secret = require('crypto').randomBytes(48).toString('hex');
    const addToken = await db.addToken(con, username, secret);

    // create the payload
    const payload = {
        username: username,
        password: password
    };

    // create the token
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    if (addToken) {
        return new Response(JSON.stringify({ token: token }), { status: 200 });
    }

    return new Response("Error while loging in", { status: 401 });
}

/**
 * Function that will check if the user is logged in or not
 * @param {Request} req the request
 * @returns {Response} the response if the user is logged in or not
 */
async function checkAuth(req) {
    const token = req.headers.authorization.split(' ')[1]; // Authorization header 
    console.log(token);

}

export default { auth, checkAuth } 