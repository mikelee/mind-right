const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('is NOT logged in');
        res.redirect('/login');
    }
}

module.exports = middlewareObj;