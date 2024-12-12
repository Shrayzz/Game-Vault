// Constructeur de popup

// Fonction générique pour déclencher un popup (succès ou erreur)
function triggerPopup(type, message, timeout) {
    const e = new CustomEvent(`${type}-popup`, {
        detail: {
            message: message,
            timeout: timeout
        }
    });
    document.dispatchEvent(e);
}

// Ecouteur générique pour les popups de succès et d'erreur
['success', 'error'].forEach(type => {
    document.addEventListener(`${type}-popup`, (e) => {
        const { message, timeout } = e.detail;
        showPopup(type, message, timeout);
    });
});

// Affichage du popup avec un timeout
function showPopup(type, message, timeout) {
    let div, p;

    try {
        if (type === 'success') {
            div = document.getElementById('success');
            p = document.getElementById('success-text');
        } else if (type === 'error') {
            div = document.getElementById('error');
            p = document.getElementById('error-text');
        }

        // Affiche le popup correspondant
        div.style.display = 'block';
        p.innerText = message;

        // Cache le popup après le délai
        setTimeout(() => {
            div.style.display = 'none';
        }, timeout);
    }
    catch (err) {
        console.warn(`No popup display: Bad type! ${err.message}`)
    }
}

export default triggerPopup;