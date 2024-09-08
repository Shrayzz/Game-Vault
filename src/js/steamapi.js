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
 * @param {int} appid the appid of the app
 * @param {boolean} debug if you want to output the response to a json file
 * @returns {Promise<JSON>} the app details
 */
async function GetAppDetails(appid, debug = false) {

    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);

    const d = response.data;

    if (debug) {
        // debug - writing it to a json file
        fs.writeFile('data.json', JSON.stringify(d, null, 2), err => {
            if (err) {
                console.error(err);
            } else {
                console.log('success');
            }
        });
    }

    // TODO: add an arg to choose the type like dlc / software ?
    // TODO: return only the usefull data
    if (d[appid].data.type === "game") {
        return data;
    }

    return null;
}

// (async () => {
//     const a = await GetApps(true);
//     console.log(a);

//     const b = await GetAppDetails("10", true);
//     console.log(b);
// })();

module.exports = { GetApps, GetAppDetails }