window.addEventListener("DOMContentLoaded", async () => {
  const accountButton = document.getElementById('accountButton');
  const token = localStorage.getItem("token");

  if (token) {
    const check = await fetch("http://localhost:3000/api/checkAuth", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const username = localStorage.getItem("username");

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

    if (check.ok && username) {
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

  const label = document.createElement('label');
  label.className = 'login';
  label.innerHTML = 'Login';

  button.appendChild(img);
  button.appendChild(label);
  accountButton.appendChild(button);
  return;

});