document.addEventListener("DOMContentLoaded", async () => {
    const filterContainer = document.getElementById("filter-container");
    const openFilter = document.getElementById("open-filter");
    const validateFilter = document.getElementById("validate-filter");
    const recommendations = document.querySelector(".recommendation");
    const allGames = document.querySelector(".all-games");
    const headerContent = document.getElementById("header-content");
  
    const dateMinSelect = document.getElementById("date-min");
    const dateMaxSelect = document.getElementById("date-max");
    const genreCheckboxes = document.getElementById("genre-checkboxes");
  
    if (!genreCheckboxes) {
      console.error("Element with id 'genre-checkboxes' not found!");
      return;
    }
  
    const minYear = 2000;
    const maxYear = 2019;
  
    // date
    for (let year = minYear; year <= maxYear; year++) {
      const optionMin = document.createElement("option");
      const optionMax = document.createElement("option");
  
      optionMin.value = year;
      optionMin.textContent = year;
      optionMax.value = year;
      optionMax.textContent = year;
  
      dateMinSelect.appendChild(optionMin);
      dateMaxSelect.appendChild(optionMax);
    }
  
    // Ouvrir les filtres
    openFilter.addEventListener("click", (e) => {
      e.preventDefault();
      filterContainer.style.display = "block";
      recommendations.style.display = "none";
      allGames.style.display = "none";
      headerContent.style.display = "none";
    });
  
    // 
    validateFilter.addEventListener("click", async () => {
      filterContainer.style.display = "none";
      recommendations.style.display = "block";
      allGames.style.display = "block";
      headerContent.style.display = "block";
  
      // Récupérer les dates 
      const dateMin = parseInt(dateMinSelect.value, 10);
      const dateMax = parseInt(dateMaxSelect.value, 10);
  
      // Récupérer les genres 
      const selectedGenres = Array.from(genreCheckboxes.querySelectorAll("input:checked"))
        .map((checkbox) => checkbox.value);
  
      try {
         const apiUrl = new URL("https://steamcdn-a.akamaihd.net/steam/apps/${gameId}");
        apiUrl.searchParams.append("minYear", dateMin);
        apiUrl.searchParams.append("maxYear", dateMax);
        
        selectedGenres.forEach(genre => {
          apiUrl.searchParams.append("genres[]", genre);
        });
  
        // requête l'API
        const gamesResponse = await fetch(apiUrl);
  

        if (!gamesResponse.ok) {
          throw new Error("API error: " + gamesResponse.statusText);
        }
  
        const allGamesData = await gamesResponse.json();
  

        displayFilteredGames(allGamesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error);
      }
    });
  
    // afficher les jeux filtrés
    const displayFilteredGames = (games) => {
      const gamesContainer = document.querySelector("#games-container");  
      gamesContainer.innerHTML = '';  
  
      if (games.length === 0) {
        gamesContainer.innerHTML = '<p>Aucun jeu trouvé pour cette période.</p>';
      } else {
        games.forEach((game) => {
          const gameElement = document.createElement("div");
          gameElement.classList.add("game-item");
  
          gameElement.innerHTML = `
            <img src="${game.coverImage}" alt="${game.title}" />
            <h3>${game.title}</h3>
            <p>${game.release_date}</p>
            <p>Genres : ${game.genres.map(genre => genre.description).join(", ")}</p>
          `;
          gamesContainer.appendChild(gameElement);
        });
      }
    };
  
    // récupérer les genres uniques via l'API
    const fetchUniqueGenres = async () => {
      console.log("Fetching genres...");
      const genresSet = new Set();
  
      try {
        const response = await fetch("http://localhost:3000/api/steam/genres");
  

        if (!response.ok) {
          throw new Error("API error: " + response.statusText);
        }
  
        const genresData = await response.json();
        console.log("Genres fetched:", genresData);
  
        genresData.forEach((genre) => genresSet.add(genre.description));
      } catch (err) {
        console.error("Erreur lors de la récupération des genres :", err);
      }
  
      return Array.from(genresSet);
    };
  
    // remplir les genres dans les cases à cocher
    const populateGenres = async () => {
      const genres = await fetchUniqueGenres();
      console.log("Genres to populate:", genres);
  
      genres.forEach((genre) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
  
        checkbox.type = "checkbox";
        checkbox.value = genre;
        label.textContent = genre;
  
        label.insertBefore(checkbox, label.firstChild);
        genreCheckboxes.appendChild(label);
      });
    };
  
    // ajouter les genres
    await populateGenres();
  
    // Fonction pour récupérer les détails d'un jeu 
    const fetchGameDetails = async (gameId) => {
      try {
        const gameResponse = await fetch(`http://localhost:3000/api/steam/appdetail?appid=${gameId}`, {
          method: "GET",
        });
  
        
        if (!gameResponse.ok) {
          throw new Error(`Erreur lors de la récupération du jeu avec l'ID ${gameId}: ${gameResponse.statusText}`);
        }
  
        // réponse JSON
        const game = await gameResponse.json();
        return game;  
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du jeu :", error);
        return null;  
      }
    };

  

  });
  