import triggerPopup from './popupBuilder.js';

document.addEventListener('DOMContentLoaded', () => {
    const Rbtn = document.getElementById("submitBtn");
    const Lbtn = document.getElementById("loginBtn");
    const Pbtn = document.getElementById("fpBtn");
    const NPbtn = document.getElementById("newPBtn");
    const Ebtn = document.getElementById("emailBtn");
    const errorDiv = document.getElementById("error");
    const errorP = document.getElementById("error-text");
    const successDiv = document.getElementById("success");
    const successP = document.getElementById("success-text");

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
                    window.location.href = "/login?success=true";
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

    if (Lbtn) {
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

                if (response.ok) {
                    window.location.href = "/library";
                    triggerPopup('success', '✔️ㆍYou\'re successfully logged to your account', 5000);
                    return;
                } else if (response.status === 401) {
                    triggerPopup('error', '❌ㆍInvalid username or password. Try again.', 5000);
                    return;
                } else {
                    triggerPopup('error', '❌ㆍThis account doesn\'t exist. Try again or register.', 5000);
                    return;
                }
            } catch (err) {
                triggerPopup('error', `⛔ㆍAn error occurred: ${err.message}`, 5000);
                console.log(err);
            }
        });
    }

    if (Pbtn) {
        Pbtn.addEventListener("click", async () => {
            try {
                const email = document.getElementById("fp_email").value.trim();

                if (!email) {
                    triggerPopup('error', '❌ㆍPlease enter your email', 5000);
                    return;
                }

                const response = await fetch("http://localhost:3000/api/forgot-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: email }),
                });

                if (response.ok) {
                    triggerPopup('success', '✔️ㆍAccount found! An email has been sent into your mailbox.', 2500);
                } else {
                    triggerPopup('error', '❌ㆍThis account doesn\'t exist. Try again or create a new account.', 2500);
                }
            } catch (err) {
                triggerPopup('error', `⛔ㆍAn error occurred: ${err.message}`, 5000);
                console.log(err);
            }
        });
    }
    if (NPbtn) {
        NPbtn.addEventListener("click", async () => {
            try {
                const password = document.getElementById("password").value.trim();
                const c_password = document.getElementById("confirm_password").value.trim();

                const token = new URLSearchParams(window.location.search).get("token");

                if (!password || !c_password) {
                    triggerPopup('error', '❌ㆍPlease fill both input !', 5000);
                    return;
                }

                if (password !== c_password) {
                    triggerPopup('error', '❌ㆍPasswords do not match!', 5000);
                    return;
                }

                let finalPasswd = password;

                const response = await fetch("http://localhost:3000/api/reset-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: token, newPassword: finalPasswd }),
                });

                if (response.ok) {
                    triggerPopup('success', '✔️ㆍ Passsword successfully Reset ! ', 2500);
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2500);
                } else {
                    triggerPopup('error', '❌ㆍ Error while reseting password !', 2500);
                }
            } catch (err) {
                triggerPopup('error', `⛔ㆍAn error occurred: ${err.message}`, 5000);
                console.log(err.message);
            }
        });
    }
});