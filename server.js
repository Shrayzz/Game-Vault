import { serve } from "bun";
import path from "path";
import db from "./src/js/db"


// middleware functions
import register from "./src/middleware/register";
import auth from "./src/middleware/auth";

await db.dbConnectServer('localhost', 'root', 'root');
await db.dbInit();
const con = await db.dbConnect('localhost', 'root', 'root', 'simplegamelibrary');

const server = serve({
    async fetch(req) {

        const url = new URL(req.url);

        // GET routes
        if (req.method === 'GET' && url.pathname === "/") {
            // do a function to verify if logged in ?
            const authResponse = await auth.authToken(req, con);
            if (authResponse.status !== 200) {
                return authResponse;
            }
            return new Response(Bun.file(path.join(__dirname, "public", "html", "index.html")));
        }

        if (req.method === 'GET' && url.pathname === "/login") return new Response(Bun.file(path.join(__dirname, "public", "html", "login.html")));
        if (req.method === 'GET' && url.pathname === "/register") return new Response(Bun.file(path.join(__dirname, "public", "html", "register.html")));
        if (req.method === 'GET' && url.pathname === "/myspace") return new Response(Bun.file(path.join(__dirname, "public", "html", "space.html")));
        if (req.method === 'GET' && url.pathname === "/forgot-password") return new Response(Bun.file(path.join(__dirname, "public", "html", "new", "forgot-password.html")));
        if (req.method === 'GET' && url.pathname === "/new-password") return new Response(Bun.file(path.join(__dirname, "public", "html", "new", "new-password.html")));

        // POST routes
        if (req.method === 'POST' && url.pathname === "/api/auth") return await auth.auth(req, con);
        if (req.method === 'POST' && url.pathname === "/api/register") return await register(req, con);


        // get files in public directory
        const fpath = path.join(__dirname, "public", url.pathname.substring(1));
        const file = Bun.file(fpath);

        // return public file if it exist
        if (await file.exists()) {
            return new Response(file);
        }

        if (await auth.authToken(req, con) !== Response.ok) return new Response("Forbidden", { status: 403 });

        return new Response("Not found", { status: 404 });
    },
    port: 3000
});

console.log(`Server Running at ${server.url.href}`);

