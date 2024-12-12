document.addEventListener("DOMContentLoaded", () => {
    const modeOptions = document.querySelectorAll(".modeOption");
    const themeOptionsContainer = document.querySelector(".themeOptions");

    const themes = {
        dark: ["darkWhite", "darkBlue", "darkGreen", "darkOrange", "darkYellow", "darkPurple", "darkPink", "darkCyan"],
        light: ["lightWhite", "lightBlue", "lightGreen", "lightOrange", "lightYellow", "lightPurple", "lightPink", "lightCyan"]
    };

    const currentTheme = localStorage.getItem("theme") || "lightRed";
    const currentMode = currentTheme.startsWith("dark") ? "dark" : "light";

    // Appliquer le thème initial
    document.body.classList.add(currentMode);
    applyTheme(currentTheme);

    // Basculer entre les modes clair et sombre
    modeOptions.forEach(option => {
        option.addEventListener("click", () => {
            const isDarkMode = option.classList.contains("darkMode");
            const newMode = isDarkMode ? "dark" : "light";

            modeOptions.forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");

            document.body.className = isDarkMode ? "dark" : "light";
            const newTheme = isDarkMode ? themes.dark[0] : themes.light[0];
            applyTheme(newTheme);
            populateThemeOptions(newMode);
        });
    });

    // Générer les options de thèmes
    function populateThemeOptions(mode) {
        themeOptionsContainer.innerHTML = "";

        themes[mode].forEach(theme => {
            const button = createThemeButton(theme);
            themeOptionsContainer.appendChild(button);
        });

        const firstButton = themeOptionsContainer.querySelector(".themeOption");
        if (firstButton) {
            firstButton.classList.add("selected");
        }
    }

    // Création d'un bouton de thème
    function createThemeButton(theme) {
        const button = document.createElement("button");
        button.className = "themeOption";
        const img = document.createElement("img");
        img.src = `/resources/images/${theme}.png`;
        img.alt = `${theme} Theme`;
        button.appendChild(img);

        button.addEventListener("click", () => {
            document.querySelectorAll(".themeOption").forEach(opt => opt.classList.remove("selected"));
            button.classList.add("selected");
            applyTheme(theme);
        });

        return button;
    }

    // Appliquer un thème
    function applyTheme(theme) {
        document.body.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }

    // Initialiser les options de thème
    populateThemeOptions(currentMode);
});
