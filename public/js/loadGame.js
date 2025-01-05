window.addEventListener('DOMContentLoaded', async () => {
    // Get the game
    const gameResponse = await fetch(`http://localhost:3000/api/steam/appdetail${window.location.search}`, {
        method: "GET",
    });
    const game = await gameResponse.json();
    console.log(game);

    // Get elements to update
    const titleBox = document.getElementById('gameTitle');
    const subtitleBox = document.getElementById('gameSubtitle');
    const releaseDateBox = document.getElementById('releaseDate');
    const gameGenreBox = document.getElementById('gameGenre');
    const publishersBox = document.getElementById('publisher');
    const developersBox = document.getElementById('developers');
    const priceBox = document.getElementById('price');
    const categoryBox = document.getElementById('categories');
    const descriptionBox = document.getElementById('description');
    const metacriticBox = document.getElementById('metacritic');
    const requirementsBox = document.getElementById('requirements');

    // update de page
    titleBox.innerHTML = game.name;
    subtitleBox.innerHTML = "";
    releaseDateBox.innerHTML = `Release date : ${game.release_date}`;
    gameGenreBox.innerHTML = `Genre : ${game.genres[0].description}`; // TODO display all genres
    publishersBox.innerHTML = `Publishers : ${game.publishers[0]}`; // TODO display all publishers
    developersBox.innerHTML = `Developers : ${game.developers[0]}`; // TODO display all developpers
    priceBox.innerHTML = `Price : ${game.price}`;
    categoryBox.innerHTML = `Categories : ${game.categories[0].description}`; // TODO display all categories
    descriptionBox.innerHTML = game.desc;
    metacriticBox.innerHTML = `Metacritic : ${game.metacritic}`;
    requirementsBox.innerHTML = game.requirements.minimum; //TODO display all requirements
    // TODO display plateforms
});