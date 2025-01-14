const games = [
  { id: 367520, name: "Game 1" },
  { id: 311210, name: "Game 2" },
  { id: 377160, name: "Game 3" },
  { id: 730, name: "Game 4" },
  { id: 271590, name: "Game 5" },
  { id: 433340, name: "Game 6" },
  { id: 264710, name: "Game 7" },
  { id: 304390, name: "Game 8" },
  { id: 262060, name: "Game 9" },
];

let currentStartIndex = 0;

function getVisibleGamesCount() {
  const width = window.innerWidth;
  if (width <= 760) return 1; //  1 game
  if (width <= 1300) return 2; // 2 games
  return 3; // 3 games showing
}


function updateVisibleGames() {
  const visibleGames = getVisibleGamesCount(); // number visible games
  for (let i = 0; i < 3; i++) {
    const gameContainer = document.getElementById(`game-container-${i + 1}`);
    if (i < visibleGames) {
      const gameIndex = (currentStartIndex + i) % games.length;
      const game = games[gameIndex];

      // game container
      gameContainer.style.display = "block";
      gameContainer.querySelector("a").href = `/game?appid=${game.id}`;
      gameContainer.querySelector("img").src = getGameImageUrl(game.id);
    } else {
      gameContainer.style.display = "none"; 
    }
  }
}


function moveCarousel(direction) {
  const visibleGames = getVisibleGamesCount();
  currentStartIndex = (currentStartIndex + direction * visibleGames + games.length) % games.length;
  updateVisibleGames();
}

function getGameImageUrl(gameId) {
  return `https://steamcdn-a.akamaihd.net/steam/apps/${gameId}/header.jpg`;
}


updateVisibleGames();

// responsive
window.addEventListener("resize", updateVisibleGames);


document.querySelector('.prev').addEventListener('click', () => moveCarousel(-1));
document.querySelector('.next').addEventListener('click', () => moveCarousel(1));

 

// // Test scroll 
// document.addEventListener("DOMContentLoaded", () => {
//     const allGamesSection = document.querySelector(".all-games");
//     const recommendationSection = document.querySelector(".recommendation");
//     const pageTop = document.documentElement;
  
//     let touchStartY = 0;
//     let touchEndY = 0;
//     let scrollThrottle = false;
  
//     const scrollToPosition = (target, offset = 0) => {
//       const targetPosition = target.getBoundingClientRect().top + window.pageYOffset + offset;
//       window.scrollTo({ top: targetPosition, behavior: "smooth" });
//     };
  
//     const isInAllGames = () => {
//       const rect = allGamesSection.getBoundingClientRect();
//       return rect.top <= 0 && rect.bottom > window.innerHeight;
//     };
  
//     // molette
//     window.addEventListener("wheel", (e) => {
//       if (scrollThrottle) return;
//       scrollThrottle = true;
//       setTimeout(() => (scrollThrottle = false), 500);
  
//       if (isInAllGames() && e.deltaY > 0) {
//         return;
//       }
  
//       if (e.deltaY > 0) {
//         // Molette bas
//         scrollToPosition(allGamesSection, -100);
//       } else if (e.deltaY < 0) {
//         // Molette haut
//         scrollToPosition(pageTop);
//       }
//     });
  
//     // Touches fléchées
//     window.addEventListener("keydown", (e) => {
//       if (isInAllGames() && e.key === "ArrowDown") {
//         return;
//       }
  
//       if (e.key === "ArrowDown") {
//         scrollToPosition(allGamesSection, -100);
//       } else if (e.key === "ArrowUp") {
//         scrollToPosition(pageTop);
//       }
//     });
  
//     // trackpad
//     window.addEventListener("touchstart", (e) => {
//       touchStartY = e.changedTouches[0].screenY;
//     });
  
//     window.addEventListener("touchend", (e) => {
//       touchEndY = e.changedTouches[0].screenY;
  
//       if (isInAllGames() && touchStartY > touchEndY) {
//         return;
//       }
  
//       if (touchStartY > touchEndY + 50) {
//         // vers le haut
//         scrollToPosition(allGamesSection, -100);
//       } else if (touchStartY < touchEndY - 50) {
//         // vers le bas
//         scrollToPosition(pageTop);
//       }
//     });
//   });
  