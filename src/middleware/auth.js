import jwt from "jsonwebtoken";

/**
 * Function login an users based on credentiels given
 * @param {Request} req the request with credentials
 * @returns {Response} the response if the user has logged in or not
 */
async function auth(req) {
    const { username, password } = req.body;

    // check for credentials if they exists or not
    const usernameExist = await db.checkUser(username); //TODO: edit based on db functions
    const passwordExist = await Bun.password.verify(password, await db.getPassword(username)); //TODO: edit based on db functions

    // return error if credentials are invalid
    if (!usernameExist || !passwordExist) {
        return new Response("Invalid Credentials !", { status: 401 });
    }

    // generate a secret key
    const secret = require('crypto').randomBytes(48).toString('hex'); console.log(token); // check if it work

    // create the payload
    const payload = {
        username: username,
        password: password
    };

    // create the token
    const token = jwt.sign(payload, secret, { expiresIn: '' });

    return new Response({ msg: "User logged in !", token: token });

}

module.exports = { auth }