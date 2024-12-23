window.addEventListener("DOMContentLoaded", async () => {
  const accountButton = document.getElementById('accountButton');
  const token = localStorage.getItem("token");

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

    const label = document.createElement('label');
    label.className = 'login';
    label.innerHTML = username;

    button.appendChild(img);
    button.appendChild(label);
    accountButton.appendChild(button);
    return;
  }
  // }

  const button = document.createElement('button');
  button.className = 'loginPage';
  button.addEventListener('click', () => {
    window.location.href = '/login';
  })

  const img = document.createElement('img');
  img.src = '/resources/images/user.png';
  img.alt = 'User';
  img.className = 'loginImg';

  const label = document.createElement('label');
  label.className = 'login';
  label.innerHTML = 'Login';

  button.appendChild(img);
  button.appendChild(label);
  accountButton.appendChild(button);
  return;

});