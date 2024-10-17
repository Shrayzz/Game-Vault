import { serve } from "bun";
import path from "path";
import db from "./src/js/db"

// middleware functions
import register from "./src/middleware/register";
import auth from "./src/middleware/auth";
import email from "./src/middleware/email"

await db.dbConnectServer('localhost', 'root', 'root');
await db.dbInit();
const con = await db.dbConnect('localhost', 'root', 'root', 'simplegamelibrary');

const server = serve({
    async fetch(req) {

        const url = new URL(req.url);

        // Enable CORS
        const headers = new Headers({
            "Access-Control-Allow-Origin": "*", // Change this to your allowed origin(s)
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        });

        // public routes

        // Handle preflight OPTIONS request
        if (req.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers });
        }

        const responseHeaders = new Headers(headers);

        // POST
        if (req.method === 'POST' && url.pathname === "/api/checkAuth") return new Response(await auth.checkToken(req, con), { headers: responseHeaders });
        if (req.method === 'POST' && url.pathname === "/api/auth") return new Response(await auth.auth(req, con), { headers: responseHeaders });
        if (req.method === 'POST' && url.pathname === "/api/register") return new Response(await register(req, con), { headers: responseHeaders });
        if (req.method === 'POST' && url.pathname === "/api/email") return new Response(await email(req, con), { headers: responseHeaders });

        // GET
        if (req.method === 'GET' && url.pathname === "/") return new Response(Bun.file(path.join(__dirname, "public", "html", "index.html")));
        if (req.method === 'GET' && url.pathname === "/space") return new Response(Bun.file(path.join(__dirname, "public", "html", "space.html")));
        if (req.method === 'GET' && url.pathname === "/login") return new Response(Bun.file(path.join(__dirname, "public", "html", "login.html")));
        if (req.method === 'GET' && url.pathname === "/register") return new Response(Bun.file(path.join(__dirname, "public", "html", "register.html")));
        if (req.method === 'GET' && url.pathname === "/forgot-password") return new Response(Bun.file(path.join(__dirname, "public", "html", "new", "forgot-password.html")));
        if (req.method === 'GET' && url.pathname === "/new-password") return new Response(Bun.file(path.join(__dirname, "public", "html", "new", "new-password.html")));

        // get files in public directory
        const fpath = path.join(__dirname, "public", url.pathname.substring(1));
        const file = Bun.file(fpath);

        // return public file if it exist
        if (await file.exists()) {
            return new Response(file);
        }

        return new Response((Bun.file(path.join(__dirname, "public", "html", "error", "404.html"))), { status: 404 });
    },
    port: 3000
});

console.log(`Server Running at ${server.url.href}`);

