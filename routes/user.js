const router = require("express").Router();
const User = require("../models/User");
const { checkAuthenticated } = require("../controllers/authController");


router.get("/:username/settings", checkAuthenticated, async (req, res) => {

    if (req.params.username == req.user.username) {
        const user = await User.findOne({ username: req.user.username })

        res.render("user_settings", {user: req.user})
    }

    res.redirect("/login")

})

module.exports = router;