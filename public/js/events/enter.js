const buttons = {
    register: document.getElementById("registerBtn"),
    login: document.getElementById("loginBtn"),
    np: document.getElementById("npBtn"),
    fp: document.getElementById("fpBtn"),
};

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        for (const key in buttons) {
            const button = buttons[key];
            if (button && button.offsetParent !== null) {
                button.click();
                break; 
            }
        }
    }
});
