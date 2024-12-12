const register = document.getElementById("registerBtn");
const login = document.getElementById("loginBtn");
const np = document.getElementById("npBtn");
const fp = document.getElementById("fpBtn");

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        register.click();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        login.click();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        np.click();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        fp.click();
    }
});
