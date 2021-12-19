const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");
const { checkNotAuthenticated } = require("../controllers/authController");


router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {

    if (req.body.password == req.body.password2) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
      });
      console.log(user)
      await user.save();
    } else {
      res.redirect('/auth/register')
    }

    res.redirect("/auth/login");

  } catch (error) {
    console.log(error);
    res.redirect("/auth/register");
  }
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => res.redirect("/board/user/" + req.user.username)
);

router.post("/logout", (req, res) => {
  req.logOut();
  res.redirect("/auth/login");
});



module.exports = router;
