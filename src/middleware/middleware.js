import { jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

/**
 * check the token
 * @param {string} token the token
 * @returns {boolean} true if valid token or false if error or invalid token
 */
async function verifyTokenCookie(token) {
    const secretKey = new TextEncoder().encode(process.env.JWT_TOKEN);
    try {
        const { payload } = await jwtVerify(token, secretKey);
        const currentTime = Math.floor(Date.now() / 1000);
        // check token expiration time 
        if (payload.exp < currentTime) {
            return false;
        }
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Middleware to check if user is still logged in or not
 * @param {Request} req the request
 * @param {string} url the requested url
 * @param {Headers} headers the headers
 * @returns
 */
async function middleware(req, url) {
    const protectedRoutes = ["/library", "/profile"];
    const publicRoutes = ["/login", "/register", "/forgot-password"];

    // get cookies
    const cookieHeader = req.headers.get('cookie');
    let token = null;

    if (cookieHeader) {
        // parse cookies
        const cookies = Object.fromEntries(cookieHeader.split(';').map(cookie => {
            const [name, value] = cookie.split('=');
            return [name.trim(), value.trim()];
        }));

        token = cookies.token;
    }

    // private routes check (if not logged in -> /login)
    if (protectedRoutes.some(path => url.pathname.startsWith(path))) {

        // allow blizzard redirect oauth url
        // if (url.pathname === '/profile' && url.searchParams.get('code') && url.searchParams.get('state')) {
        //     return null;
        // }

        if (!token || !(await verifyTokenCookie(token))) {
            return Response.redirect('/login', 302);
        }

        // public route check (if logged in -> /profile)
    } else if (publicRoutes.some(path => url.pathname.startsWith(path))) {
        if (token && await verifyTokenCookie(token)) {
            return Response.redirect('/profile', 302);
        }
    }

    // all clear, continue to next handler
    return null;
}

export default middleware;
