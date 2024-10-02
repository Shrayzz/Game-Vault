const btn = document.getElementById("submitBtn");
const errorDiv = document.getElementById("error");
const errorP = document.getElementById("error-text");

btn.addEventListener("click", async () => {
    try {
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const cemail = document.getElementById("cemail").value.trim();
        const password = document.getElementById("password").value.trim();
        const cpassword = document.getElementById("cpassword").value.trim();

        // Masquer les messages d'erreur au début
        errorDiv.style.display = "none";

        // Vérification de base
        if (!username || !email || !cemail || !password || !cpassword) {
            errorDiv.style.display = "block";
            errorP.innerHTML = "❌ㆍNot all inputs are filled !";
            setTimeout(() => {
                errorDiv.style.display = "none";
            }, 5000);
            return;
        }

        // Vérification que les emails et mots de passe correspondent
        if (email !== cemail || password !== cpassword) {
            errorDiv.style.display = "block";
            errorP.innerHTML = "❌ㆍEmails / Passwords do not match!";
            setTimeout(() => {
                errorDiv.style.display = "none";
            }, 5000);
            return;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordPattern.test(password)) {
            errorDiv.style.display = "block";
            errorP.innerHTML = "❌ㆍPassword must contain at least 8 characters, one uppercase, one lowercase, and one number.";
            setTimeout(() => {
                errorDiv.style.display = "none";
            }, 5000);
            return;
        }

        // Vérification du format de l'email
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            errorDiv.style.display = "block";
            errorP.innerHTML = "❌ㆍPlease enter a valid email address.";
            setTimeout(() => {
                errorDiv.style.display = "none"; 
            }, 5000);
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
        } else {
            const data = await response.json();
            errorDiv.style.display = "block";
            errorP.innerHTML = `❌ㆍError: ${data.message}`;
            setTimeout(() => {
                errorDiv.style.display = "none"; 
            }, 5000);
        }
    } catch (err) {
        errorDiv.style.display = "block";
        errorP.innerHTML = `⛔ㆍAn error occurred: ${err.message}`;
        setTimeout(() => {
            errorDiv.style.display = "none"; 
        }, 5000);
    }
});
