//TODO: Ajouter les jeux avec l'API de steam
const nameList = document.getElementById('name-list');
const container = document.getElementById('sContainer');

window.numGame = 0;
for (window.numGame; window.numGame < 100; window.numGame++) {
    const newLine = document.createElement("li");
    newLine.textContent = `Jeux n°${window.numGame}`;
    nameList.appendChild(newLine);
}
const button = document.createElement("button");
button.textContent = 'Afficher 100 de plus';
container.appendChild(button);

button.addEventListener('click', function () {
    const nameList = document.getElementById('name-list');
    let arret = window.numGame + 100
    for (window.numGame; window.numGame < arret; window.numGame++) {
        const newLine = document.createElement("li");
        newLine.textContent = `Jeux n°${window.numGame}`;
        nameList.appendChild(newLine);
    }
})
