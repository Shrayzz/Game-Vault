import db from "../db";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

/**
 * create an access token if credentials are correct
 * @param {Request} req the request with credentials
 * @param {object} pool The pool connection
 * @returns {Response} the response if the user has logged in or not
 */
async function auth(req, pool, headers) {
  try {
    const { username, password } = await req.json();

    // check for credentials if they exists or not
    const usernameExist = await db.existUser(pool, username);
    const passwordExist = await Bun.password.verify(
      password,
      await db.getUserPassword(pool, username),
    );

    // return error if credentials are invalid
    if (!usernameExist || !passwordExist) {
      return new Response("Invalid Credentials !", {
        status: 401,
        headers: headers,
      });
    }

    // create the payload
    const payload = {
      username: username,
    };

    const secret = new TextEncoder().encode(
      process.env.JWT_TOKEN
    );

    // create the token
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    if (token !== null) {
      headers.append("Content-Type", "application/json");
      headers.append("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`);
      headers.append("Set-Cookie", `username=${username}; Path=/; Max-Age=3600; SameSite=Strict`);
      return new Response(JSON.stringify({ token: token }), {
        status: 200,
        headers: headers,
      });
    }

    return new Response("Error while loging in", {
      status: 401,
      headers: headers,
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * logout the user by deleting the token and username cookies
 * @param {Request} req the request
 * @param {object} headers the headers to be sent in the response
 * @returns {Response} the response indicating the user has logged out
 */
async function logout(req, headers) {
  try {
    headers.append("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict");
    headers.append("Set-Cookie", "username=; Path=/; Max-Age=0; SameSite=Strict");
    return new Response("Logged out successfully", {
      status: 200,
      headers: headers,
    });
  } catch (err) {
    console.log(err);
    return new Response("Error while logging out", {
      status: 500,
      headers: headers,
    });
  }
}

export default { auth, logout   };
