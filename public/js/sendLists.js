import triggerPopup from "./popupBuilder.js";

const addFavoriteButton = document.getElementById('addFavoriteButton');
const favoriteImage = addFavoriteButton.querySelector('img');
let isFavorite = false;

addFavoriteButton.addEventListener('click', async () => {
    try {
        // Get the username
        const cookieString = document.cookie;
        const cookieParts = cookieString.split('; ');
        let cookies = [];
        for (const part of cookieParts) {
            cookies.push(part.split('='));
        }

        cookies.forEach((cookie) => {
            if (cookie[0] === "username") {
                window.username = cookie[1]
            }
        })
        const username = window.username

        // Get the game
        const gameId = window.location.search.substring(7);

        // console.log(username)
        // console.log(gameId)

        if (username && gameId) {
            const response = await fetch(
                "http://localhost:3000/api/addGameToFavorite",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        gameId: gameId,
                    }),
                }
            );

            if (response.status === 502) {
                triggerPopup('error', '❌ㆍUser does not exist', 5000);
                return;
            }

            if (response.status === 500 || response.status === 404) {
                triggerPopup('error', '❌ㆍAn error occurred', 5000);
                return;
            }

            if (response.status === 302) {
                triggerPopup('error', '❌ㆍThe game is already in favorite', 5000);
                return;
            }

            if (response.status === 200) {
                isFavorite = true;
                favoriteImage.src = "../resources/images/favoris_is_add.png";
                triggerPopup('success', '✔️ㆍThe game is added to favorites', 5000);
                return;
            }
        }
    } catch (error) {
        triggerPopup('error', '❌ㆍUser or Game not found', 5000);
        return;
    }
});