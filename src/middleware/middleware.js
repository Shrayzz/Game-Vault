import { jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to check if user is still logged in or not
 * @param {Request} req the request
 * @param {string} url the requested url
 * @param {Headers} headers the headers
 * @returns
 */
async function middleware(req, url) {
    const protectedRoutes = ["/library", "/profile"];
    const secretKey = new TextEncoder().encode(process.env.JWT_TOKEN);

    if (protectedRoutes.some(path => url.pathname.startsWith(path))) {

        // allow blizzard redirect oauth url
        if (url.pathname === '/profile' && url.searchParams.get('code') && url.searchParams.get('state')) {
            return null;
        }

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

        try {
            const { payload } = await jwtVerify(token, secretKey);
            const currentTime = Math.floor(Date.now() / 1000);
            // check token expiration time 
            if (payload.exp < currentTime) {
                return Response.redirect('/login', 302);
            }
        } catch (err) {
            return Response.redirect('/login', 302);
        }


        // cache allow to go to previous pages but not to interact with it
    }

    // all clear, continue to next handler
    return null;
}

export default middleware;
