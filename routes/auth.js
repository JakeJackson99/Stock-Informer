const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/register");
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
  (req, res) => res.redirect("/dashboard/" + req.user.username)
);

router.post("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  }
  next();
}

module.exports = router;
