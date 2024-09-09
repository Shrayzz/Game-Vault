const axios = require('axios');
const fs = require('fs');

/**
 * Function to get all apps from the steam api 
 * @param {boolean} debug if you want to output the response to a json file
 * @return {Promise<JSON>} the apps list
 */
async function GetApps(debug = false) {

    const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');

    const data = response.data;

    // remove all apps that have an empty name
    const result = data.applist.apps.filter((elt) => elt.name != "");

    if (debug) {
        // debug - writing it to a json file
        fs.writeFile('data.json', JSON.stringify(result, null, 2), err => {
            if (err) {
                console.error(err);
            } else {
                console.log('success');
            }
        });
    }
    return result;
}

/**
 * Function to get the details of an app from the steam api
 * @param {string} appid the appid of the app
 * @param {boolean} debug if you want to output the response to a json file
 * @returns {Promise<JSON>} the app details
 */
async function GetAppDetails(appid, debug = false) {

    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}&l=english`);

    const data = response.data;

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
}

(async () => {
    const a = await GetApps(true);
    // console.log(a);
    const b = await GetAppDetails("2183900", true);
    console.log(b);
})();

module.exports = { GetApps, GetAppDetails }