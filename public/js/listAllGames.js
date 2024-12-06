//TODO: Ajouter les jeux avec l'API de steam
const nameList = document.getElementById('name-list');
const container = document.getElementById('sContainer');

let i = 0;
for (i; i < 100; i++) {
    const newLine = document.createElement("li");
    newLine.textContent = `Jeux n°${i}`;
    nameList.appendChild(newLine);
}
const button = document.createElement("button");
button.textContent = 'Afficher 100 de plus';
container.appendChild(button);

button.addEventListener('click', function () {
    showMoreGames();
})

function showMoreGames() {
    const nameList = document.getElementById('name-list');
    i = 0
    for (i; i < 100; i++) {
        const newLine = document.createElement("li");
        newLine.textContent = `Jeux n°${i}`;
        nameList.appendChild(newLine);
    }
}