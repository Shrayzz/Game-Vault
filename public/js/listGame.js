document.addEventListener("DOMContentLoaded", () => {
  const addListBtn = document.getElementById("add-list-btn");
  const listContainer = document.getElementById("list-container");

  addListBtn.addEventListener("click", () => {
    // new game list
    const newListItem = document.createElement("div");
    newListItem.classList.add("list-item");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Name the list...");

    input.focus();

    // Validation 
    input.addEventListener("keypress", async (e) => {
      if (e.key === "Enter" && input.value.trim() !== "") {
        const name = input.value.trim();
        newListItem.textContent = name;
        newListItem.style.fontWeight = "bold";
        newListItem.style.color = "#000";

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

        const response = await fetch(
          "http://localhost:3000/api/addList",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              listName: name,
            }),
          }
        );

        if (response.status === 502) {
          triggerPopup('error', '❌ㆍUser does not exist', 5000);
          return;
        }
        if (response.status === 500 || response.status === 404) {
          triggerPopup('error', '❌ㆍAn error occurred', 5000);
          return;
        }

      }
    });

    newListItem.appendChild(input);
    listContainer.appendChild(newListItem);
  });
});
