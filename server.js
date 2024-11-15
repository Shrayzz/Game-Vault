import { serve } from "bun";
import path from "path";
import db from "./src/js/db";

import "dotenv/config";

import indexRouter from "./src/routes/indexRouter";
import apiRouter from "./src/routes/apiRouter";

await db.dbConnectServer("localhost", "root", "root");
await db.dbInit();

const con = await db.dbConnect(
  "localhost",
  "root",
  "root",
  "SimpleGameLibrary",
);

const server = serve({
  async fetch(req) {
    const url = new URL(req.url);

    // Enable CORS
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // get files in public directory
    const fpath = path.join(__dirname, "public", url.pathname.substring(1));
    const file = Bun.file(fpath);

    // return public file if it exist
    if (await file.exists()) {
      headers.append("Content-Type", file.type);
      return new Response(file);
    }

    const indexReq = await indexRouter(req, url, con, headers);
    if (indexReq) return indexReq;

    const apiReq = await apiRouter.apiRouter(req, url, con, headers);
    if (apiReq) return apiReq;

    const blizzardReq = await apiRouter.blizzardRouter(req, url, headers);
    if (blizzardReq) return blizzardReq;

    return new Response(
      Bun.file(path.join(__dirname, "public", "html", "error", "404.html")),
      { status: 404 },
    );
  },

  port: 3000,
});

console.log(`Server Running at ${server.url.href}`);
