window.addEventListener("DOMContentLoaded", async () => {
    const accountButton = document.getElementById('accountButton');

    const cookieString = document.cookie;
    const cookieParts = cookieString.split('; ');
    let cookies = [];
    for (const part of cookieParts) {
        cookies.push(part.split('='));
    }

    cookies.forEach((cookie) => {
        if (cookie[0] === "username") {
            window.username = cookie[1]
        }
    })
    const username = window.username

    if (username) {
        const response = await fetch(
            `http://localhost:3000/api/getUserImage?username=${username}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const image = await response.json()

        const button = document.createElement('button');
        button.className = 'loginPage';
        button.addEventListener('click', () => {
            window.location.href = '/profile';
        })

        const img = document.createElement('img');
        img.alt = 'User';
        img.className = 'loginImg';
        if (image !== null) {
            img.src = image
        } else {
            img.src = '/resources/images/user.png';
        }
        img.addEventListener("mouseenter", () => {
            img.style.transform = "scale(1.1)";
            img.style.transition = "transform 0.3s ease";
        });

        img.addEventListener("mouseleave", () => {
            img.style.transform = "scale(1)";
        });

        const label = document.createElement('label');
        label.className = 'login';
        label.innerHTML = username;

        button.appendChild(img);
        button.appendChild(label);
        accountButton.appendChild(button);
        return;
    }

    const button = document.createElement('button');
    button.className = 'loginPage';
    button.addEventListener('click', () => {
        window.location.href = '/login';
    })

    const img = document.createElement('img');
    img.src = '/resources/images/user.png';
    img.alt = 'User';
    img.className = 'loginImg';

    img.addEventListener("mouseenter", () => {
        img.style.transform = "scale(1.1)";
        img.style.transition = "transform 0.3s ease";
    });

    img.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)";
    });

    const label = document.createElement('label');
    label.className = 'login';
    label.innerHTML = 'Login';

    button.appendChild(img);
    button.appendChild(label);
    accountButton.appendChild(button);
    return;

});