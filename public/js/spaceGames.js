// Carousel des recommendation 
let currentSlide = 0;

function moveCarousel(direction) {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    
    const totalSlides = slides.length;

   currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

   carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

    document.querySelector('.prev').classList.toggle('hidden', currentSlide === 0);
   
}


document.querySelector('.prev').classList.add('hidden');



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
  

  