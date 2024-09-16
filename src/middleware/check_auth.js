/**
 * Middleware to check if the user is logged in or not
 * @description to ensure he cant get in by taping /home in url
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function checkAuth(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = checkAuth;
