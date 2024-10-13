import db from "../js/db"
import { SignJWT, decodeJwt, jwtVerify } from 'jose'

/**
 * create an access token if credentials are correct
 * @param {Request} req the request with credentials
 * @returns {Response} the response if the user has logged in or not
 */
async function auth(req, con) {
    try {
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

        const secret = new TextEncoder().encode(await db.getUserToken(con, username)); // needed UTF-8

        // create the token
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1m')
            .sign(secret);

        if (token !== null) {
            return new Response(JSON.stringify({ token: token }), { status: 200 });
        }

        return new Response("Error while loging in", { status: 401 });
    } catch (err) {
        console.log(err);
    }
}

/**
 * Function that will check the given token in the request and verify if it is valid
 * @param {Request} req the request
 * @returns {Response} the response if the token is valid or not
 */
async function checkToken(req, con) {
    try {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader && authHeader.split(' ')[1]; // extract the token from auth header

        if (!token) {
            // return false;
            return new Response({ status: 401 });
        }

        const decoded = decodeJwt(token);

        // check expiration timestamp
        if (Math.floor(Date.now() / 1000) > decoded.exp) {
            // return false;
            return new Response("Connection expired", { status: 401 });
        }

        if (!decoded || !decoded.username) {
            // return false
            return new Response("User not found", { status: 401 });
        }

        const userKey = new TextEncoder().encode(await db.getUserToken(con, decoded.username)); // needed UTF-8

        const verified = await jwtVerify(token, userKey);

        if (!verified) {
            // return false;
            return new Response("Token is invalid", { status: 401 });
        }

        // return true;
        return new Response('Valid Token', { status: 200 });

    } catch (err) {
        console.log(err.message);
        return new Response(err.message, { status: 500 });
    }
}

export default { auth, checkToken } 