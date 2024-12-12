import triggerPopup from "./popupBuilder.js";
// import db from "../../src/js/db.js";

const pp = document.getElementById("pp");
const imgInput = document.getElementById("imgInput");

function showImgDialog() {
  imgInput.click();
}

function updateProfileImage(event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    reader.onload = function (e) {
      pp.src = e.target.result;
      triggerPopup(
        "success",
        "✔️ㆍProfile picture updated successfully!",
        5000,
      );
    };

    reader.readAsDataURL(file);
  } else {
    triggerPopup("error", "❌ㆍPlease select a valid image file.", 5000);
  }
}

function editUsername() {
  const u = document.getElementById("username");
  const uInput = document.getElementById("usernameInput");
  const pen = document.getElementById("pencil");

  pen.style.display = "none";
  u.style.display = "none";
  uInput.style.display = "inline";
  uInput.value = u.textContent;
  uInput.focus();
}

function saveUsername() {
  const u = document.getElementById("username");
  const uInput = document.getElementById("usernameInput");
  const pen = document.getElementById("pencil");

  if (uInput.value.trim() === "") {
    triggerPopup("error", "❌ㆍUsername cannot be empty!", 5000);
  }
  if (uInput.value.length > 20) {
    triggerPopup("error", "❌ㆍMax characters reached! (Max: 20)", 5000);
  }

  (async () => {
    try {
      const oldUsername = localStorage.getItem("username")
      const newUsername = uInput.value

      const response = await fetch(
        "http://localhost:3000/api/updateUsername",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldUsername: oldUsername,
            newUsername: newUsername,
          }),
        }
      );

      if (response.status === 502) {
        triggerPopup('error', '❌ㆍUser does not exist!', 5000);
        return;
      }
      if (response.status === 500 || response.status === 404) {
        triggerPopup('error', '❌ㆍAn error occurred', 5000);
        return;
      }

      localStorage.setItem("username", newUsername);
      u.textContent = uInput.value;
      pen.style.display = "inline";
      uInput.style.display = "none";
      u.style.display = "inline";
    } catch (error) {
      triggerPopup('error', `⛔ㆍAn error occurred: ${error.message}`, 5000);
      return;
    }
  })();

}

export function logout() {
  try {
    localStorage.removeItem(token);
    window.Location.href = "/";
  } finally {
    return;
  }
}

function saveToken() {
  const param = new URLSearchParams(document.location.search);
  param.get("code")
    ? localStorage.setItem("bnetAppCode", param.get("code"))
    : undefined;
}

window.showImgDialog = showImgDialog;
window.updateProfileImage = updateProfileImage;
window.editUsername = editUsername;
window.saveUsername = saveUsername;

const usernameTitle = document.getElementById('username')

window.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  usernameTitle.innerHTML = username;
});

// TODO : Intégrer la sauvegarde des élements dans le localStorage ou dans la DB
