const axios = require('axios');
const fs = require('fs');

/**
 * Function to get all apps from the steam api 
 * @param {boolean} debug if you want to output the response to a json file
 * @return {Promise<object>} the apps list in JSON format
 */
async function GetAllApps(debug = false) {

    const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');

    const data = response.data;

    // remove all apps that have an empty name
    for (let i = data.applist.apps.length - 1; i >= 0; i--) { // .filter instead ?
        const elt = data.applist.apps[i];
        if (elt.name === "") {
            data.applist.apps.splice(i, 1);
        }
    }
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
    return data;
}

/**
 * Function to keep only apps that are games
 * @param {boolean} debug
 * @return {Promise<object>} the apps list in JSON format
 */
async function SortApps(debug = false) {
    const data = await GetAllApps();

    for (let i = data.applist.apps.length - 1; i >= 0; i--) {
        const elt = data.applist.apps[i];
        const appId = elt.appid;

        const response = await axios.get(`http://store.steampowered.com/api/appdetails?appids=${appId}`);

        const appData = response.data;

        console.log(`${i}`);

        if (appData[appId].success) {
            if (!(appData[appId].data.type === "game")) {
                data.applist.apps.splice(i, 1);
            }
        }
        else {
            console.log("game");
        }
    }

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

    console.log("done");
    return data;
}

(async () => {
    // await GetAllApps(true);
    const data = require('../../data.json')
    console.log(data.applist.apps.length);
})();



// TODO: sort only apps that are games
// TODO: from sorted apps extract essentials info for each apps

