import "dotenv/config";
import axios from "axios";

//TODO: put in an async function
/**
 * Create your instance with Xbox live API
 */
const instance = axios.create({
    baseURL: 'https://xbl.io/api/v2/',
    timeout: 5000,
    headers: { 'X-Authorization': process.env.XBOX_API_KEY }
})

/**
 * Return your account informations
 * @returns 
 */
async function getAccount() {
    try {
        const response = await instance.get('/account');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

//Test
/* 
(async () => {
    let data = await getAccount();
    console.log(data);
})();
*/