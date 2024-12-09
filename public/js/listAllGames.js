//TODO: Ajouter les jeux avec l'API de steam
const nameList = document.getElementById('name-list');
const container = document.getElementById('sContainer');

let i = 1;
for (i; i < 100 + 1; i++) {
    const newLine = document.createElement("li");
    newLine.textContent = `Jeux n°${i}`;
    nameList.appendChild(newLine);
}
const button = document.createElement("button");
button.textContent = 'More Games (+100)';
container.appendChild(button);

button.addEventListener('click', () => {
    showMoreGames();
})

function showMoreGames() {
    const nameList = document.getElementById('name-list');
    i = 1
    for (i; i < 100 + 1; i++) {
        const newLine = document.createElement("li");
        newLine.textContent = `Jeux n°${i}`;
        nameList.appendChild(newLine);
    }
}