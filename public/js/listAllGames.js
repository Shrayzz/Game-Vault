(async () => {
    // get the page elements
    const nameList = document.getElementById('name-list');
    const addButton = document.getElementById('addButton');

    // get all steam games
    const steamGames = await fetch("http://localhost:3000/api/steam/apps", {
        method: "GET",
    });
    // put the games in the window in JSON
    window.allGames = await steamGames.json();

    // put an increment in the window
    window.numGame = 0;

    // list 100 firsts games
    for (window.numGame; window.numGame < 100; window.numGame++) {
        // get game list element
        const nameList = document.getElementById('name-list');
        // we stop in 100 games
        let arret = window.numGame + 100
        // list 100 more games
        for (window.numGame; window.numGame < arret; window.numGame++) {
            // add a new line
            const newLine = document.createElement("div");
            // get the game ID
            const gameId = window.allGames[window.numGame]?.appid
            const gameName = window.allGames[window.numGame]?.name
            newLine.textContent = gameName;
            nameList.appendChild(newLine);
        }
    }

    // When button click list 100 more games
    addButton.addEventListener('click', async function () {
        // get game list element
        const nameList = document.getElementById('name-list');
        // we stop in 100 games
        let arret = window.numGame + 100
        // list 100 more games
        for (window.numGame; window.numGame < arret; window.numGame++) {
            // add a new line
            const newLine = document.createElement("li");
            // get the game ID
            const gameId = window.allGames[window.numGame]?.appid
            const gameName = window.allGames[window.numGame]?.name
            newLine.textContent = `Jeux n°${gameId} : ${gameName}`;
            nameList.appendChild(newLine);
        }
    })

})()