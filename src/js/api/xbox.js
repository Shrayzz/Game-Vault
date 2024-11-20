import "dotenv/config";
import axios from "axios";

/**
 * Create your instance with Xbox live API
*/
async function XboxConnect() {
    const instance = axios.create({
        baseURL: 'https://xbl.io/api/v2/',
        timeout: 25000,
        headers: { 'X-Authorization': process.env.XBOX_API_KEY }
    })
    return instance
}

/**
 * Return your account informations
 * @param {object} instance the instance for XboxLive API
 * @returns {object} profileUsers data
 */
async function getXboxAccount(instance) {
    try {
        const response = await instance.get('/account');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * return all new games of Xbox marketplace
 * @param {object} instance the instance for XboxLive API 
 * @returns {object} new games of Xbox marketplace
 */
async function getNewGames(instance) {
    try {
        const response = await instance.get('/marketplace/new');
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/**
 * return a game with his title ID
 * @param {object} instance the instance for XboxLive API
 * @param {string} id the ID of the game
 * @returns {object} the game of the title ID
 */
async function getGameByTitleId(instance, id) {
    try {
        const response = await instance.get(`/marketplace/title/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

// async function test() {
//     const instance = await XboxConnect();
//     // console.log(await getNewGames(instance));
//     //Genshin Impact
//     const game = await getGameByTitleId(instance, '2053080068');
//     console.log(game.Products[0].LocalizedProperties[0].DeveloperName);
//     console.log(game.Products[0].LocalizedProperties[0].ProductTitle);
// };
// test();

export default {
    XboxConnect,
    getXboxAccount,
}