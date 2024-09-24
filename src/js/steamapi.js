const fs = require('fs');
require('dotenv').config()

/**
 * Function to get all apps from the steam api 
 * @param {boolean} debug if you want to output the response to a json file
 * @return {Promise<JSON>} the apps list
 */
async function GetApps(debug = false) {

    try {
        const response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        // remove all apps that have an empty name
        const result = data.applist.apps.filter((elt) => elt.name != "");

        if (debug) {
            // debug - writing it to a json file
            fs.writeFile('data.json', JSON.stringify(result, null, 2), err => {
                if (err) {
                    console.error(err);
                }
            });
        }

        return result;

    } catch (err) {
        console.error(err.message)
    }
}

/**
 * Function to get the details of an app from the steam api
 * @param {string} appid the appid of the app
 * @param {boolean} debug if you want to output the response to a json file
 * @returns {Promise<JSON>} the app details
 */
async function GetAppDetails(appid, debug = false) {

    try {
        const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&l=english`);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        if (debug) {
            // debug - writing it to a json file
            fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('success');
                }
            });
        }

        // check if the appid is correct
        if (!data[appid].success) {
            return null;
        } else if (data[appid].data.type === "game") { // TODO: add an arg to choose the type like dlc / software ?
            // TODO: not all apps have all of this below
            return {
                name: data[appid].data.name,
                developers: data[appid].data.developers,
                publishers: data[appid].data.publishers,
                type: data[appid].data.type,
                genres: data[appid].data.genres,
                categories: data[appid].data.categories,
                desc: data[appid].data.about_the_game,
                metacritic: data[appid].data.metacritic ? data[appid].data.metacritic.score : "no score",
                price: data[appid].data.price_overview ? data[appid].data.price_overview.final_formatted : "no price",
                release_date: data[appid].data.release_date.date,
                requirements: data[appid].data.pc_requirements,
                platforms: data[appid].data.platforms
            };
        }
    } catch (err) {
        console.error(err.message)
    }
}

/**
 * Function to get games owned by the specified account steamid
 * @param {string} steamId steamid of the account to get owned games
 * @param {boolean} debug if you want to output the response to a json file
 * @returns {Promise<Object>} the owned games list of the account
 */
async function GetOwnedGames(steamid, debug = false) {
    try {
        const response = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.TOKEN}&steamid=${steamid}&format=json`);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        if (debug) {
            // debug - writing it to a json file
            fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.error(err);
                }
            });
        }

        return data;

    } catch (err) {
        console.error(err.message)
    }
}

/**
 * Function to get friends of the specified account steamid
 * @param {string} steamid steamid of the account to get friends
 * @param {boolean} debug if you want to output the response to a json file
 * @returns {Promise<Object>} the friends list of the account
 */
async function GetFriends(steamid, debug = false) {
    try {
        const response = await fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.TOKEN}&steamid=${steamid}&relationship=friend`);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        if (debug) {
            // debug - writing it to a json file
            fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.error(err);
                }
            });
        }

        return data;

    } catch (err) {
        console.error(err.message)
    }
}

/**
 * 
 * @param {string} steamid steamid of the account to get the summary of it 
 * @param {boolean} debug if you want to output the response to a json file
 * @returns {Promise<Object>} the account steamid summary
 */
async function GetPlayerSummary(steamid, debug = false) {
    try {
        const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.TOKEN}&steamids=${steamid}`);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        if (debug) {
            // debug - writing it to a json file
            fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.error(err);
                }
            });
        }

        // TODO: select what to return
        return data;

    } catch (err) {
        console.error(err.message)
    }
}

/**
 * 
 * @param {string} steamid steamid of the account to get the achivements of it
 * @param {string} appid appid to get the achivements earned by the specified steamid account
 * @param {boolean} debug if you want to output the response to a json file
 * @returns {Promise<Object>} the achhivements list for the specified appid of the steamid account
 */
async function GetPlayerAchivements(steamid, appid, debug = false) {
    try {
        const response = await fetch(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${process.env.TOKEN}&steamid=${steamid}`);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        if (debug) {
            // debug - writing it to a json file
            fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.error(err);
                }
            });
        }

        return data;

    } catch (err) {
        console.error(err.message)
    }
}

(async () => {
    const a = await GetPlayerSummary('76561199168266214', true);
    // console.log(a);
    // const b = await GetAppDetails("1222140", true);
    // console.log(b);
})();

module.exports = { GetApps, GetAppDetails }