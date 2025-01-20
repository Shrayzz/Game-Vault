document.addEventListener("DOMContentLoaded", async () => {
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
  let games = []
  for (let i = 0; i < favoriteGames.length; i++) {
    games.push({
      id: favoriteGames[i].id,
      title: favoriteGames[i].gameInfo.name,
      isLiked: true,
    })
  }

  const container = document.getElementById("list-container");
  const validateBtn = document.getElementById("validate-btn");

  const Games = () => {
    container.innerHTML = "";
    games.forEach((game) => {
      const gameCard = document.createElement("div");
      // TODO add an image
      gameCard.classList.add("list-item");
      gameCard.innerHTML = `
      <span>${game.title}</span>
      <img
      src="${game.isLiked
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
    //TODO suppr Liked=False game of Fav
    // Delete games from favorites
    games.forEach(async (game) => {
      if (!game.isLiked) {
        const response = await fetch(
          `http://localhost:3000/api/deleteFavoriteGame`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              gameId: game.id,
            }),
          }
        );

        if (response.status === 502) {
          triggerPopup('error', '❌ㆍUser does not exist!', 5000);
          return;
        }
        if (response.status === 500 || response.status === 404) {
          triggerPopup('error', '❌ㆍAn error occurred', 5000);
          return;
        }
      }
    })
    // Filter games to display
    const likedGames = games.filter((game) => game.isLiked);
    games.length = 0;
    games.push(...likedGames);
    Games();
  });

  Games();
});
