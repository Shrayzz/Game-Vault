const currentTheme = localStorage.getItem('theme')
document.getElementById('theme-btn').addEventListener('click', toggleTheme)

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode')
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode')

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark')
    } 
    else {
        localStorage.setItem('theme', 'light')
    }
}

function showPopup(type) {
    const success = document.getElementById("success");
    const error = document.getElementById("error");
    
    if (type === "success" && success) {
        success.classList.add("display-popup");    
        success.classList.remove("popup"); 
        setTimeout(function() {
            success.classList.remove("display-popup");    
            success.classList.add("popup"); 
        }, 3000);
    } 
    else if (type === "error" && error) {
        error.classList.add("display-popup");    
        error.classList.remove("popup"); 
        setTimeout(function() {
            error.classList.remove("display-popup");    
            error.classList.add("popup");
        }, 3000);
    }
}