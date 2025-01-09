
const games = [
    { id: 40, name: "Game 1" },
    { id: 10, name: "Game 2" },
    { id: 20, name: "Game 3" },
    { id: 30, name: "Game 4" },
    { id: 50, name: "Game 5" },
    { id: 60, name: "Game 6" },
    { id: 70, name: "Game 7" },
    { id: 80, name: "Game 8" },
    { id: 130, name: "Game 9" },
  ];
  

  let currentStartIndex = 0;  
  

  function getGameImageUrl(gameId) {
    return `https://steamcdn-a.akamaihd.net/steam/apps/${gameId}/header.jpg`;
  }
  
 
  function updateVisibleGames() {
    for (let i = 0; i < 3; i++) {
      const gameImg = document.getElementById(`game-${i + 1}`);
      const gameIndex = (currentStartIndex + i) % games.length;  
      const game = games[gameIndex];  
  

      gameImg.src = getGameImageUrl(game.id);
      gameImg.alt = game.name;
    }
  }
  

  function moveCarousel(direction) {

    currentStartIndex = (currentStartIndex + direction + games.length) % games.length;
  

    updateVisibleGames();
  }

  updateVisibleGames();
  
  

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
  

  