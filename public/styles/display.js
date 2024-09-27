const currentTheme = localStorage.getItem('theme')
document.getElementById('theme-btn').addEventListener('click', toggleTheme)

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode')
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode')

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    }
    else {
        localStorage.setItem('theme', 'light');
    }
}
