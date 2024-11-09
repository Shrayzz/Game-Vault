window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
        }

        const check = await fetch("http://localhost:3000/api/checkAuth", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!check.ok) {
            window.location.href = "/login";
        }
    } catch (err) {
        console.log(err.message);
    }
});