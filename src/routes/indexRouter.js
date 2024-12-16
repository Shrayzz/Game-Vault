import path from "path";

async function indexRouter(req, url, pool, headers) {
  // GET
  if (req.method === "GET" && url.pathname === "/")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "index.html"),
      ),
    );
  if (req.method === "GET" && url.pathname === "/library")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "library.html"),
      ),
    );
    if (req.method === "GET" && url.pathname === "/library2")
      return new Response(
        Bun.file(
          path.join(__dirname, "..", "..", "public", "html", "library2.html"),
        ),
      );
  if (req.method === "GET" && url.pathname === "/game")
      return new Response(
        Bun.file(
          path.join(__dirname, "..", "..", "public", "html", "game.html"),
        ),
      );
  if (req.method === "GET" && url.pathname === "/login")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "login.html"),
      ),
    );
  if (req.method === "GET" && url.pathname === "/register")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "register.html"),
      ),
    );
  if (req.method === "GET" && url.pathname === "/profile")
    return new Response(
      Bun.file(
        path.join(__dirname, "..", "..", "public", "html", "profile.html"),
      ),
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
    );

  return null;
}

export default indexRouter;
