import 'dotenv/config'

const bnetID = process.env.BNET_CLIENT_ID
const bnetSECRET = process.env.BNET_SECRET

/**
 * 
 * @param {string} clientID the blizzard client ID
 * @param {string} clientSecret the blizzard client SECRET
 * @returns {Promise<Object>} the token
 */
async function getAccessToken(clientID, clientSecret) {
    try {
        const response = await fetch('https://oauth.battle.net/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                'client_id': clientID,
                'client_secret': clientSecret
            })
        });

        const data = await response.json();
        return {
            token: data.access_token,
            expires_in: data.expires_in // expires in one day
        }
    } catch (err) {
        console.error(err);
    }
}


(async () => {
    const data = await getAccessToken(bnetID, bnetSECRET);
    console.log(data);
})();