e = true;
function ShowHidePassword(password, eye) {
    if (e) {
        document.getElementById(password).setAttribute("type", "text");
        document.getElementById(eye).src = "/resources/images/hide.png";
        e = false;
    }
    else {
        document.getElementById(password).setAttribute("type", "password");
        document.getElementById(eye).src = "/resources/images/show.png";
        e = true;
    }
}