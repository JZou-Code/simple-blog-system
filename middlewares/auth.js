function authOfHome(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/anonymous");
    }
}

function authOfLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash('message', "Sorry, you need to log in first")
        res.redirect("/account/login");
    }
}

function authOfLoginMessage(req, res, next) {
    if (req.session.user) {
        req.session.isLoggedIn = true;
    } else {
        req.session.isLoggedIn = false;
    }
    next();
}

module.exports = {
    authOfHome,
    authOfLogin,
    authOfLoginMessage
};
