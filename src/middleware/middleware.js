import { jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to check if user is still login or not
 * @param {Request} req the request
 * @param {string} url the requested url
 * @param {Headers} headers the headers
 * @returns
 */
async function middleware(req, url, headers) {
    const protectedRoutes = ["/library", "/profile"];
    const secretKey = new TextEncoder().encode(process.env.JWT_TOKEN);

    if (protectedRoutes.some(path => url.pathname.startsWith(path))) {
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
    }

    // all clear, continue to next handler
    return null;
}

export default middleware;
