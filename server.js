import { serve } from "bun";
import path from "path";

// token for sessions so when expired user is disconnected ? to generate and store in DB
// https://bun.sh/guides/util/hash-a-password


const server = serve({
    async fetch(req) {

        const url = new URL(req.url);

        // routes
        if (url.pathname === "/") return new Response(Bun.file(path.join(__dirname, "index.html")));
        if (url.pathname === "/login") return new Response(Bun.file(path.join(__dirname, "src", "public", "html", "login.html")));

        // get files in public directory
        const fpath = path.join(__dirname, "src", "public", url.pathname.substring(1));
        const file = Bun.file(fpath);

        // return public file if it exist
        if (await file.exists()) {
            return new Response(file);
        }

        return new Response("Not found", { status: 404 });
    },
    port: 3000
});

console.log(`Server Running at ${server.url.href}`);

