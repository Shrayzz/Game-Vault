document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById("theme-btn");
    const modeOptions = document.querySelectorAll(".modeOption");
    const themeOptionsContainer = document.querySelector(".themeOptions");

    const themes = {
        dark: ["darkRed", "darkBlue", "darkGreen", "darkOrange", "darkYellow", "darkPurple", "darkPink", "darkCyan"],
        light: ["lightRed", "lightBlue", "lightGreen", "lightOrange", "lightYellow", "lightPurple", "lightPink", "lightCyan"]
    };

    const currentTheme = localStorage.getItem("theme") || "lightRed";
    const currentMode = currentTheme.startsWith("dark") ? "dark" : "light";

    document.body.classList.add(currentMode);
    applyTheme(currentTheme);

    themeBtn.addEventListener("click", () => {
        const newMode = document.body.classList.contains("dark") ? "light" : "dark";
        document.body.classList.toggle("dark");

        const newTheme = newMode === "dark" ? themes.dark[0] : themes.light[0];
        applyTheme(newTheme);
        populateThemeOptions(newMode);
    });

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

    function createThemeButton(theme) {
        const button = document.createElement("button");
        button.className = "themeOption";
        button.innerText = theme;

        button.addEventListener("click", () => {
            document.querySelectorAll(".themeOption").forEach(opt => opt.classList.remove("selected"));
            button.classList.add("selected");
            applyTheme(theme);
        });

        return button;
    }

    function applyTheme(theme) {
        document.body.className = theme.startsWith("dark") ? "dark" : "light";
        document.body.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }

    populateThemeOptions(currentMode);
});
