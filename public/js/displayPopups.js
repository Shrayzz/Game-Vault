document.addEventListener('DOMContentLoaded', () => {
    const Rbtn = document.getElementById("submitBtn");
    const Lbtn = document.getElementById("loginBtn");
    const NPbtn = document.getElementById("newPBtn");
    const Ebtn = document.getElementById("emailBtn");
    const errorDiv = document.getElementById("error");
    const errorP = document.getElementById("error-text");
    const successDiv = document.getElementById("success");
    const successP = document.getElementById("success-text");

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
        catch {
            console.warn("No popup display: Bad type!")
        }
    }

    if (Rbtn) {
        Rbtn.addEventListener("click", async () => {
            try {
                const username = document.getElementById("r_username").value.trim();
                const email = document.getElementById("email").value.trim();
                const cemail = document.getElementById("cemail").value.trim();
                const password = document.getElementById("r_password").value.trim();
                const cpassword = document.getElementById("cpassword").value.trim();
    
                // Masquer les messages d'erreur au début
                errorDiv.style.display = "none";
    
                // Vérification de base
                if (!username || !email || !cemail || !password || !cpassword) {
                    triggerPopup('error', '❌ㆍNot all inputs are filled !', 5000);
                    return;
                }
    
                // Vérification que les emails et mots de passe correspondent
                if (email !== cemail || password !== cpassword) {
                    triggerPopup('error', '❌ㆍEmails / Passwords do not match!', 5000);;
                    return;
                }
    
                const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d._-]{8,}$/
                if (!passwordPattern.test(password)) {
                    triggerPopup('error', '❌ㆍPassword must contain at least 8 characters, one uppercase, one lowercase, and one number.', 5000);
                    return;
                }
    
                // Vérification du format de l'email
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailPattern.test(email)) {
                    triggerPopup('error', '❌ㆍPlease enter a valid email address.', 5000);
                    return;
                }
    
                // Si tout est bon, envoi de la requête
                const response = await fetch(
                    "http://localhost:3000/api/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            email: email,
                            password: password,
                        }),
                    }
                );
    
                if (response.ok) {
                    window.location.href = "/login";
                } else if (response.status === 502) {
                    triggerPopup('error', '❌ㆍUser already exists!', 5000);
                    return;
                }
            } catch (err) {
                triggerPopup('error', `⛔ㆍAn error occurred: ${err.message}`, 5000);
                return;
            }
        });
    }

    if(Lbtn) {
        Lbtn.addEventListener("click", async () => {
            try {
                const username = document.getElementById("l_username").value.trim();
                const password = document.getElementById("l_password").value.trim();
    
                if (!username || !password) {
                    triggerPopup('error', '❌ㆍNot all inputs are filled', 5000);
                    return;
                }
    
                const response = await fetch("http://localhost:3000/api/auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    await fetch("http://localhost:3000/", {
                        method: "GET",
                        headers: {
                            Bearer: data.token,
                        },
                    });
                    console.log("ok");
                    window.location.href = "/";
                    //pop up to says succesfull login
                    return;
                } else {
                    console.log("pas ok");
                    // pop up to say incorrect login or please register
                    return;
                }
            } catch (err) {
                triggerPopup('error', `⛔ㆍAn error occurred: ${err.message}`, 5000);
                console.log(err);
            }
        });
    }
});