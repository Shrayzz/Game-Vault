import triggerPopup from './popupBuilder.js';

const pp = document.getElementById('pp');
const imgInput = document.getElementById('imgInput');

function showImgDialog() {
    imgInput.click();
}

function updateProfileImage(event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function (e) {
            pp.src = e.target.result;
            triggerPopup('success', '✔️ㆍProfile picture updated successfully!', 5000);
        };

        reader.readAsDataURL(file);
    } else {
        triggerPopup('error', '❌ㆍPlease select a valid image file.', 5000);
    }
}

function editUsername() {
    const u = document.getElementById('username');
    const uInput = document.getElementById('usernameInput');
    const pen = document.getElementById('pencil');

    pen.style.display = 'none';
    u.style.display = 'none';
    uInput.style.display = 'inline';
    uInput.value = u.textContent;
    uInput.focus();
}

function saveUsername() {
    const u = document.getElementById('username');
    const uInput = document.getElementById('usernameInput');
    const pen = document.getElementById('pencil');

    if (uInput.value.trim() === '') {
        triggerPopup('error', '❌ㆍUsername cannot be empty!', 5000);
    } else if (uInput.value.length > 20) {
        triggerPopup('error', '❌ㆍMax characters reached! (Max: 20)', 5000);
    } else {
        u.textContent = uInput.value;
        pen.style.display = 'inline';
        uInput.style.display = 'none';
        u.style.display = 'inline';
    }
}

window.showImgDialog = showImgDialog;
window.updateProfileImage = updateProfileImage;
window.editUsername = editUsername;
window.saveUsername = saveUsername;

// TODO : Intégrer la sauvegarde des élements dans le localStorage ou dans la DB