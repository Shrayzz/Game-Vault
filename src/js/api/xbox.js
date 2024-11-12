import "dotenv/config";
import axios from "axios";

/**
 * Create your instance with Xbox live API
*/
async function XboxConnect() {
    const instance = axios.create({
        baseURL: 'https://xbl.io/api/v2/',
        timeout: 10000,
        headers: { 'X-Authorization': process.env.XBOX_API_KEY }
    })
    return instance
}

/**
 * Return your account informations
 * @returns 
 */
async function getXboxAccount(instance) {
    try {
        const response = await instance.get('/account');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export default { XboxConnect, getXboxAccount }