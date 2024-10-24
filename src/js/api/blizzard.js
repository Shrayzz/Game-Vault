import 'dotenv/config';

const bnetID = process.env.BNET_CLIENT_ID
const bnetSECRET = process.env.BNET_SECRET

/**
 * Funtion to authorize to get game data from the logged bnet account
 * @param {string} clientID bnet clientID
 * @param {string} redirectURI the URI to redirect after connection completed
 * @param {Array} scopes the scopes to get the data
 * @returns {Response} the redirection to the page to allow connection
 */
function linkAccount(clientID, redirectURI, scopes) {

    console.log(scopes.join(' '));

    const linkURL = `https://oauth.battle.net/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&state=AbCdEfG&scope=${scopes.join(' ')}`;

    return new Response(null, { status: 302, headers: { "Location": linkURL } });

}

/**
 * Function to get the access token for the client app
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
        return data;
    } catch (err) {
        throw new Error(err);
    }
}

export default { linkAccount, getAccessToken };