document.addEventListener("DOMContentLoaded", () => {
    const modeOptions = document.querySelectorAll(".modeOption");
    const themeOptionsContainer = document.querySelector(".themeOptions");

    const darkModeThemes = [
        "DM_white.png",
        "DM_yellow.png",
        "DM_lightBlue.png",
        "DM_pink.png",
        "DM_orange.png",
        "DM_blue.png",
        "DM_purple.png",
        "DM_green.png"
    ];

    const lightModeThemes = [
        "LM_white.png",
        "LM_yellow.png",
        "LM_lightBlue.png",
        "LM_pink.png",
        "LM_orange.png",
        "LM_blue.png",
        "LM_purple.png",
        "LM_green.png"
    ];

    function createThemeButton(theme) {
        const button = document.createElement("button");
        button.className = "themeOption";
        const img = document.createElement("img");
        img.src = `../resources/images/${theme}`;
        img.alt = theme.split('.')[0] + " Theme";
        button.appendChild(img);

    
        button.addEventListener("click", () => {
            document.querySelectorAll(".themeOption").forEach(opt => opt.classList.remove("selected"));
            button.classList.add("selected");
        });

        return button;
    }

    modeOptions.forEach(option => {
        option.addEventListener("click", () => {
            modeOptions.forEach(opt => opt.classList.remove("selected"));
            option.classList.add("selected");

            const isDarkMode = option.classList.contains("darkMode");

            // Réinitialise 
            themeOptionsContainer.innerHTML = "";

            const themes = isDarkMode ? darkModeThemes : lightModeThemes;
            themes.forEach(theme => {
                const button = createThemeButton(theme);
                themeOptionsContainer.appendChild(button);
            });

            // premier thème par défaut lorsque le mode est changé
            const firstButton = themeOptionsContainer.querySelector(".themeOption");
            if (firstButton) {
                firstButton.classList.add("selected");
            }
        });
    });
});
