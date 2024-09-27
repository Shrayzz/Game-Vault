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

document.addEventListener('DOMContentLoaded', () => {
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.page');
        sections.forEach(s => {
            if (s.id === sectionId) {
                s.classList.remove('hidden');
                s.classList.add('visible');
            } else {
                s.classList.remove('visible');
                s.classList.add('hidden');
            }
        });
    }

    document.querySelector('.login').addEventListener('click', () => {
        showSection('lParts');
    });

    document.querySelector('.fp').addEventListener('click', () => {
        showSection('pParts');
    });
});
