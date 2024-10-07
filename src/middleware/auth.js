import db from "../js/db"
import jwt from "jsonwebtoken";

/**
 * create an access token if credentials are correct
 * @param {Request} req the request with credentials
 * @returns {Response} the response if the user has logged in or not
 */
async function auth(req, con) {
    const { username, password } = await req.json();

    // check for credentials if they exists or not
    const usernameExist = await db.existUser(con, username);
    const passwordExist = await Bun.password.verify(password, await db.getUserPassword(con, username));

    // return error if credentials are invalid
    if (!usernameExist || !passwordExist) {
        return new Response("Invalid Credentials !", { status: 401 });
    }

    // create the payload
    const payload = {
        username: username,
        // password: password
    };

    const secret = await db.getUserToken(con, username);

    // create the token
    const token = jwt.sign(payload, secret, { expiresIn: '1m' });

    if (token !== null) {
        return new Response(JSON.stringify({ token: token }), { status: 200 });
    }

    return new Response("Error while loging in", { status: 401 });
}

/**
 * Function that will check the given token in the request and verify if it is valid
 * @param {Request} req the request
 * @returns {Response} the response if the token is valid or not
 */
async function authToken(req, con) {
    try {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader && authHeader.split(' ')[1]; // extract the token from auth header

        if (!token) return new Response({ status: 401 });

        const decoded = jwt.decode(token);

        if (!decoded || !decoded.username) return new Response("User not found", { status: 401 });

        const userKey = await db.getUserToken(con, decoded.username);

        const verified = jwt.verify(token, userKey);
        if (!verified) return new Response("Token is invalid", { status: 401 });

        return new Response('Valid Token', { status: 200 });

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return new Response("Connection expired", { status: 401 });
        }
        return new Response(err.message, { status: 500 });
    }
}

export default { auth, authToken } 