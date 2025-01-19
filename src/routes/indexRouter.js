import path from "path";

async function indexRouter(req, url, pool, headers) {
  // GET
  if (req.method === "GET" && url.pathname === "/")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "index.html"),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/library")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "library.html"),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/game")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "game.html"),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/game-list")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "game-list.html"),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/login")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "login.html"),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/register")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "register.html"),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/profile")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "profile.html"),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/favoris")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "favoris.html"),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/forgot-password")
    return new Response(
      Bun.file(
        path.join(
          __dirname,
          "..",
          "..",
          "public",
          "html",
          "new",
          "forgot-password.html",
        ),
      ),
      { headers }
    );
  if (req.method === "GET" && url.pathname === "/new-password")
    return new Response(
      Bun.file(
        path.join(
          __dirname,
          "..",
          "..",
          "public",
          "html",
          "new",
          "new-password.html",
        ),
      ),
      { headers }
    );

  return null;
}

export default indexRouter;
