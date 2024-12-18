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
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
          const name = input.value.trim();
          newListItem.textContent = name;
          newListItem.style.fontWeight = "bold";
          newListItem.style.color = "#000";
        }
      });
  
      newListItem.appendChild(input);
      listContainer.appendChild(newListItem);
    });
  });
  