// const fs = require("fs");
import "dotenv/config";

/**
 * Function to get all apps from the steam api
 * @param {headers} headers response headers
 * @return {Promise<JSON>} the apps list
 */
async function GetApps(headers) {
  try {
    const response = await fetch(
      `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${process.env.STEAM_TOKEN}&include_games=true`,
    );

    const data = await response.json();

    // remove all apps that have an empty name
    // const result = data.applist.apps.filter((elt) => elt.name != "");
    return new Response(JSON.stringify(data.response.apps), { status: 200, headers: headers })
  } catch (err) {
    return new Response(JSON.stringify({ "error": err.message }), { status: 500, headers: headers });
  }
}

/**
 * Function to get the details of an app from the steam api
 * @param {string} appid the appid of the app
 * @param {headers} headers response headers
 * @returns {Promise<JSON>} the app details
 */
async function GetAppDetails(appid, headers) {
  try {
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&l=english&format=json`,
    );

    const data = await response.json();

    // check if the appid is correct
    if (!data[appid].success) {
      return null;
    } else if (data[appid].data.type === "game") {
      // TODO: add an arg to choose the type like dlc / software ?
      // TODO: not all apps have all of this below
      return new Response(JSON.stringify({
        name: data[appid].data.name,
        developers: data[appid].data.developers,
        publishers: data[appid].data.publishers,
        type: data[appid].data.type,
        genres: data[appid].data.genres,
        categories: data[appid].data.categories,
        desc: data[appid].data.about_the_game,
        metacritic: data[appid].data.metacritic
          ? data[appid].data.metacritic.score
          : "no score",
        price: data[appid].data.price_overview
          ? data[appid].data.price_overview.final_formatted
          : "no price",
        release_date: data[appid].data.release_date.date,
        requirements: data[appid].data.pc_requirements,
        platforms: data[appid].data.platforms,
      }, { status: 200, headers: headers }
      ))
    }
  } catch (err) {
    return new Response(JSON.stringify({ "error": err.message }), { status: 500, headers: headers });
  }
}

/**
 * Function to get games owned by the specified account steamid
 * @param {string} steamId steamid of the account to get owned games
 * @param {headers} headers response headers
 * @returns {Promise<Object>} the owned games list of the account
 */
async function GetOwnedGames(steamid, headers) {
  try {
    const response = await fetch(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_TOKEN}&steamid=${steamid}&format=json&l=english&format=json`,
    );

    const data = await response.json();
    return new Response(JSON.stringify(data.response.games), { status: 200, headers: headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: headers });
  }
}

/**
 * Function to get friends of the specified account steamid
 * @param {string} steamid steamid of the account to get friends
 * @param {headers} headers response headers
 * @returns {Promise<Object>} the friends list of the account
 */
async function GetFriends(steamid, headers) {
  try {
    const response = await fetch(
      `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.STEAM_TOKEN}&steamid=${steamid}&relationship=friend&l=english&format=json`,
    );

    const data = await response.json();
    return new Response(JSON.stringify(data.friendslist.friends), { status: 200, headers: headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: headers });
  }
}

/**
 *
 * @param {string} steamid steamid of the account to get the summary of it
 * @param {headers} headers response headers
 * @returns {Promise<Object>} the account steamid summary
 */
async function GetPlayerSummary(steamid, headers) {
  try {
    const response = await fetch(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_TOKEN}&steamids=${steamid}&l=english&format=json`,
    );

    const data = await response.json();
    // TODO: select what to return
    return new Response(JSON.stringify(data.response.players), { status: 200, headers: headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: headers });
  }
}

/**
 *
 * @param {string} steamid steamid of the account to get the achivements of it
 * @param {string} appid appid to get the achivements earned by the specified steamid account
 * @param {headers} headers response headers
 * @returns {Promise<Object>} the achhivements list for the specified appid of the steamid account
 */
async function GetPlayerAchievements(steamid, appid, headers) {
  try {
    const response = await fetch(
      `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${process.env.STEAM_TOKEN}&steamid=${steamid}&l=english&format=json`,
    );

    const data = await response.json();
    return new Response(JSON.stringify({ steamid: data.playerstats.steamID, game: data.playerstats.gameName, achievements: data.playerstats.achievements }), { status: 200, headers: headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: headers });
  }
}

// (async () => {
//   const c = await GetApps();
//   const r = await c.json()
//   console.log(r)

// })();

export default {
  GetApps,
  GetAppDetails,
  GetOwnedGames,
  GetFriends,
  GetPlayerSummary,
  GetPlayerAchievements,
  GetAchievementsData,
};
