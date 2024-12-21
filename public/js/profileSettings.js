import triggerPopup from "./popupBuilder.js";
// import db from "../../src/js/db.js";

const pp = document.getElementById("pp");
const imgInput = document.getElementById("imgInput");

function showImgDialog() {
  imgInput.click();
}

async function updateProfileImage(event) {
  try {
    const username = localStorage.getItem("username");
    const file = await event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const readerDB = new FileReader();

      readerDB.onload = async function (e) {
        const fileURL = e.target.result;
        console.log(fileURL)
        const response = await fetch(
          "http://localhost:3000/api/updateUserImage",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              file: fileURL,
            }),
          }
        );

        if (response.status === 500) {
          triggerPopup('error', '❌ㆍAn error occurred while updating your image', 5000);
          return;
        }
        if (response.status === 500 || response.status === 404) {
          triggerPopup('error', '❌ㆍAn error occurred', 5000);
          return;
        }
      };

      readerDB.readAsDataURL(file);
    } else {
      triggerPopup("error", "❌ㆍPlease select a valid image file.", 5000);
    }

    // TODO simplifier quand update fini
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
  } catch (error) {
    triggerPopup('error', `⛔ㆍAn error occurred: ${error.message}`, 5000);
    return;
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

async function saveUsername() {
  const u = document.getElementById("username");
  const uInput = document.getElementById("usernameInput");
  const pen = document.getElementById("pencil");

  if (uInput.value.trim() === "") {
    triggerPopup("error", "❌ㆍUsername cannot be empty!", 5000);
  }
  if (uInput.value.length > 20) {
    triggerPopup("error", "❌ㆍMax characters reached! (Max: 20)", 5000);
  }

  try {
    const oldUsername = localStorage.getItem("username");
    const newUsername = uInput.value;

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

}

function logOut() {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = "/";
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

async function deleteAccount() {
  try {
    const username = localStorage.getItem("username");

    const response = await fetch(
      "http://localhost:3000/api/deleteAccount",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
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

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = "/";
  } catch (error) {
    triggerPopup('error', `⛔ㆍAn error occurred: ${error.message}`, 5000);
    return;
  }
}

window.showImgDialog = showImgDialog;
window.updateProfileImage = updateProfileImage;
window.editUsername = editUsername;
window.saveUsername = saveUsername;
window.LogOut = logOut;
window.deleteAccount = deleteAccount;

const usernameTitle = document.getElementById('username')

window.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("username");
  usernameTitle.innerHTML = username;

  // Load the user profile image
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
  if (image !== null) {
    pp.src = image
  }
});


// TODO : Intégrer la sauvegarde des élements dans le localStorage ou dans la DB
