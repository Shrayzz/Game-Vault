document.addEventListener("DOMContentLoaded", () => {
    const games = [
      { id: 1, title: "Jeux", isLiked: true },
      { id: 2, title: "Jeux", isLiked: true },
      { id: 3, title: "Jeux", isLiked: true },
      { id: 4, title: "Jeux", isLiked: true },
      { id: 5, title: "Jeux", isLiked: true },
      { id: 6, title: "Jeux", isLiked: true },
    ];
  
    const container = document.getElementById("list-container");
    const validateBtn = document.getElementById("validate-btn");
  
    const Games = () => {
      container.innerHTML = ""; 
      games.forEach((game) => {
        const gameCard = document.createElement("div");
        gameCard.classList.add("list-item");
        gameCard.innerHTML = `
          <span>${game.title}</span>
          <img
            src="${
              game.isLiked
                ? "/resources/images/like.png"
                : "/resources/images/dislike.png"
            }"
            alt="Heart Icon"
            class="heart-icon"
            data-id="${game.id}"
          />
        `;
        container.appendChild(gameCard);
      });
    };
  
    // Favorie click 
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("heart-icon")) {
        const gameId = Number(e.target.dataset.id);
        const game = games.find((g) => g.id === gameId);
        if (game) {
          game.isLiked = !game.isLiked; 
          Games(); 
        }
      }
    });
  
    // validate button
    validateBtn.addEventListener("click", () => {
      const likedGames = games.filter((game) => game.isLiked);
      games.length = 0; 
      games.push(...likedGames); 
      Games(); 
    });
  
    Games();
  });
  