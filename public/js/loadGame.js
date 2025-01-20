window.addEventListener('DOMContentLoaded', async () => {
    // Get username
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
    const username = window.username;

    // Get the game
    const gameId = window.location.search.substring(7);
    const gameResponse = await fetch(`http://localhost:3000/api/steam/appdetail?appid=${gameId}`, {
        method: "GET",
    });
    const game = await gameResponse.json();

    // Get elements to update
    const imageBox = document.getElementById('gameImage')
    const titleBox = document.getElementById('gameTitle');
    const subtitleBox = document.getElementById('gameSubtitle');
    const releaseDateBox = document.getElementById('releaseDate');
    const publishersBox = document.getElementById('publisher');
    const developersBox = document.getElementById('developers');
    const priceBox = document.getElementById('price');
    const metacriticBox = document.getElementById('metacritic');
    const gameGenreBox = document.getElementById('gameGenre');
    const categoryBox = document.getElementById('categories');
    const descriptionBox = document.getElementById('description');
    const platformsBox = document.getElementById('platforms');
    const requirementsBox = document.getElementById('requirements');

    // update de page
    // Load Image
    imageBox.src = `https://steamcdn-a.akamaihd.net/steam/apps/${gameId}/header.jpg`;
    // Load Title
    titleBox.innerHTML = game?.name;
    // Load Subtitle
    subtitleBox.innerHTML = "";
    // Load Release date
    releaseDateBox.innerHTML = `Release date : ${game?.release_date}`;
    // Load Publishers
    if (game?.publishers !== undefined) {
        let publishers = 'Publishers : ';
        game?.publishers.forEach((element) => {
            publishers += element + ', ';
        });
        publishers = publishers.slice(0, -2);
        publishersBox.innerHTML = publishers;
    } else {
        publishersBox.innerHTML = 'Publishers : Unknown'
    }
    // Load Developers
    if (game?.developers !== undefined) {
        let developers = 'Developers : ';
        game?.developers.forEach((element) => {
            developers += element + ', ';
        });
        developers = developers.slice(0, -2);
        developersBox.innerHTML = developers;
    } else {
        developersBox.innerHTML = 'Developers : Unknown'
    }
    // Load Price
    priceBox.innerHTML = `Price : ${game?.price}`;
    // Load Metacritic
    metacriticBox.innerHTML = `Metacritic : ${game?.metacritic}`;
    // Load Genres
    if (game?.genres !== undefined) {
        let genres = 'Genres : ';
        game?.genres.forEach((element) => {
            genres += element.description + ', ';
        });
        genres = genres.slice(0, -2);
        gameGenreBox.innerHTML = genres;
    } else {
        gameGenreBox.innerHTML = 'Genre : None'
    }
    // Load Categories
    if (game?.categories !== undefined) {
        let categories = 'Categories : ';
        game?.categories.forEach((element) => {
            categories += element.description + ', ';
        });
        categories = categories.slice(0, -2);
        categoryBox.innerHTML = categories;
    } else {
        categoryBox.innerHTML = 'Categories : None'
    }
    // Load Description
    descriptionBox.innerHTML = game?.desc;
    // Load Plateforms
    if (!game?.platforms?.windows && !game?.platforms?.mac && !!game?.platforms?.linux) {
        platformsBox.innerHTML = '<p><b>Plateforms:</b> none</p>';
    } else {
        let platforms = "<p><b>Plateforms:</b> ";
        if (game?.platforms?.windows) {
            platforms += "Windows, ";
        }
        if (game?.platforms?.mac) {
            platforms += "Mac, ";
        }
        if (game?.platforms?.linux) {
            platforms += "Linux, ";
        }
        platforms = platforms.slice(0, -2);
        platformsBox.innerHTML = platforms + "</p>";
    }
    // Load Requirements
    if (game?.requirements !== undefined) {
        let requirements = '';
        Object.keys(game?.requirements).forEach((element) => {
            requirements += game?.requirements[element] + '<br>';
        });
        requirements = requirements.slice(0, -4);
        requirementsBox.innerHTML = requirements;
    } else {
        requirementsBox.innerHTML = ''
    }

    // Get favorite games
    const favoriteGamesJSON = await fetch(
        `http://localhost:3000/api/getUserFavoriteGames?username=${username}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const favoriteGames = await favoriteGamesJSON.json();

    // Verify if game is already in favorite
    favoriteGames.forEach((game) => {
        if (game.id == gameId) {
            // Get favorite button
            const addFavoriteButton = document.getElementById('addFavoriteButton');
            const favoriteImage = addFavoriteButton.querySelector('img');
            // Update favorite button
            favoriteImage.src = "../resources/images/favoris_is_add.png";
        }
    })
});