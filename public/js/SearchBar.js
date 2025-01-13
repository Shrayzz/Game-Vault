const searchBar = document.querySelector('.SearchBar');
const searchButton = document.getElementById('searchButton');
const searchResults = document.querySelector('.search-results');
const searchGrid = document.getElementById('searchGrid');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const backButton = document.getElementById('backButton');
const recommendationSection = document.querySelector('.recommendation');
const allGamesSection = document.querySelector('.all-games');

// get the elements
window.addEventListener("DOMContentLoaded", () => {
  // Add ellements to search bar
  searchBar.addEventListener('input', handleSearch);
  searchButton.addEventListener('click', handleGridSearch);
  backButton.addEventListener('click', resetView);

  // Hide drop down menu
  document.addEventListener('click', (event) => {
    if (!searchBar.contains(event.target) && !searchResults.contains(event.target)) {
      searchResults.style.display = 'none';
    }
  });
});




// search entry 
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  searchResults.innerHTML = '';  

  if (!searchTerm) {
    searchResults.style.display = 'none';  
    return;
  }

  // filter ( test )
  const filteredGames = window.allGames.filter(game => game.name.toLowerCase().includes(searchTerm));
  const limitedResults = filteredGames.slice(0, 10);  // 10 results

  limitedResults.forEach(game => {
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');
    resultItem.innerHTML = `
      <img src="https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg" alt="${game.name}" />
      <span>${game.name}</span>
    `;
    resultItem.onclick = () => {
      window.location.href = `/game?appid=${game.appid}`;
    };
    searchResults.appendChild(resultItem);
  });

  searchResults.style.display = 'block';  
}









// display results in a grid when click in the button 
function handleGridSearch() {
  const searchTerm = searchBar.value.toLowerCase();
  searchGrid.innerHTML = '';  

  if (!searchTerm) return;

  //  Hide recommandaition and all games 
  recommendationSection.classList.add('hidden');
  allGamesSection.classList.add('hidden');
  searchResultsGrid.style.display = 'block';

  // filter ( test )
  const filteredGames = window.allGames.filter(game => game.name.toLowerCase().includes(searchTerm));
  const limitedResults = filteredGames.slice(0, 50);  // Limiter à 50 résultats

  // Show games in grid
  limitedResults.forEach(game => {
    const gridItem = document.createElement('a');
    gridItem.href = `/game?appid=${game.appid}`;
    gridItem.innerHTML = `
      <img src="https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg" alt="${game.name}" />
      <p>${game.name}</p>
    `;
    searchGrid.appendChild(gridItem);
  });
}

// Reset when clicking on the button back 
function resetView() {
  recommendationSection.classList.remove('hidden');
  allGamesSection.classList.remove('hidden');
  searchResultsGrid.style.display = 'none';  // Hide grid result 
}
