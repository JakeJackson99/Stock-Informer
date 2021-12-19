module.exports = {
    checkAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/auth/login");
    },
    checkNotAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            res.redirect("/board/user/" + req.user.username);
        }
        next();
    }
}