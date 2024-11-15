import "dotenv/config";

const bnetID = process.env.BNET_CLIENT_ID;

import auth from "../middleware/auth";
import register from "../middleware/register";
import blizzard from "../js/api/blizzard";

/**
 * Router function for SimpleGameLibrary api endpoint
 *
 */
async function apiRouter(req, url, con, headers) {
  // POST
  if (req.method === "POST" && url.pathname === "/api/checkAuth")
    return await auth.checkToken(req, con, headers);
  if (req.method === "POST" && url.pathname === "/api/auth")
    return await auth.auth(req, con, headers);
  if (req.method === "POST" && url.pathname === "/api/register")
    return await register(req, con);

  return null;
}

/**
 * Router function for blizzard's endpoints
 * @param {Request} req the request
 * @param {string} url the url
 * @param {Headers} headers the headers
 * @returns {Promise<Response>} response Object
 */
async function blizzardRouter(req, url, headers) {
  if (req.method === "GET" && url.pathname === "/api/blizzard/link")
    return blizzard.linkAccount(bnetID, "http://localhost:3000/profile", [
      "d3.profile",
      "wow.profile",
      "sc2.profile",
      "openid",
    ]);

  if (req.method === "POST" && url.pathname === "/api/blizzard/token")
    return await blizzard.getAccessToken("http://localhost:3000/profile", req);

  if (req.method === "POST" && url.pathname === "/api/blizzard/check")
    return await blizzard.checkAccessToken(req);

  if (req.method === "GET" && url.pathname === "/api/blizzard/wow/profile")
    return await blizzard.getWowCharacter(req, headers);

  return null;
}

export default { apiRouter, blizzardRouter };
