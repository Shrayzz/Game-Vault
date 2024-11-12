import "dotenv/config";

const bnetID = process.env.BNET_CLIENT_ID;
const bnetSECRET = process.env.BNET_SECRET;

//----------------------------------BLIZZARD OAUTH----------------------------------\\

/**
 * Funtion to authorize to get game data from the logged bnet account
 * @param {string} clientID bnet clientID
 * @param {string} redirectURI the URI to redirect after connection completed
 * @param {Array} scopes the scopes to get the data
 * @returns {Response} the redirection to the page to allow connection
 */
function linkAccount(clientID, redirectURI, scopes) {
  const linkURL = `https://oauth.battle.net/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&state=AbCdEfG&scope=${scopes.join(" ")}`;

  return new Response(null, { status: 302, headers: { Location: linkURL } });
}

/**
 * Function to get the access token for the client app
 * @param {string} the uri to redirect after logged in battle net account
 * @param {string} the request including the access code
 * @returns {Promise<Object>} the access token from the access code
 */
async function getAccessToken(redirectUri, req) {
  const reqData = await req.json();

  try {
    const response = await fetch(
      `https://oauth.battle.net/token?redirect_uri=${redirectUri}&grant_type=authorization_code&code=${reqData.code}`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic YmM3YjlmNjc4NDFkNGIxNmExNzkwNTA1MTI0ZGFhZmY6aXRURWRZUEpmR2VQTXBYdjA1NlpwTnQwczhIeHFDT1c=", //store in the .env
        },
      },
    );

    return response;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Function to check a token validity
 * @param {string} the request including the access token
 * @returns {Promise<Object>} the token metadata
 */
async function checkAccessToken(req) {
  const reqData = await req.json();

  try {
    const response = await fetch(
      `https://oauth.battle.net/oauth/check_token?token=${reqData.code}&region=eu`,
      {
        method: "POST",
      },
    );

    return response;
  } catch (err) {
    console.error(err);
  }
}

//----------------------------------WOW PROFILE----------------------------------\\

/**
 * Function to get user wow profile data
 * @param {string} token the token to use
 * @returns
 */
async function getWowProfile(token) {
  try {
    const response = await fetch(
      "https://eu.api.blizzard.com/profile/user/wow?namespace=profile-eu&locale=en-US&region=eu",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Function to get mounts list of the user
 * @param {string} token the token to use
 * @returns
 */
async function getMounts(token) {
  try {
    const response = await fetch(
      "https://eu.api.blizzard.com/profile/user/wow/collections/mounts?namespace=profile-eu&locale=en-US&region=eu",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Function to get user pets list
 * @param {string} token the token to use
 * @returns
 */
async function getPets(token) {
  try {
    const response = await fetch(
      "https://eu.api.blizzard.com/profile/user/wow/collections/pets?namespace=profile-eu&locale=en-US&region=eu",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

// getAccessToken('http://localhost:3000/profile', 'EUYG2VUYSRNKNIYMUETY3LMJGQBYSN4L8G').then((t) => console.log(t))
// checkAccessToken('EUd4BlxawnnUG35LSOy6dNwRvDDSTNhFwL').then((t) => console.log(t));
// getMounts('EUd4BlxawnnUG35LSOy6dNwRvDDSTNhFwL').then((t) => console.log(t.mounts[0]));

export default { linkAccount, getAccessToken, checkAccessToken };
