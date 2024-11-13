window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (token) {
    const check = await fetch("http://localhost:3000/api/checkAuth", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (check.ok) {
      const data = await check.json();

      localStorage.setItem("username", data.username);
      return;
    }
  } else {
    window.location.href = "/login";
    return;
  }
});

// TODO: add checkLogin here and in register so if logged in redirect to profile page.
