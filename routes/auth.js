const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const crypto = require("crypto");

const User = require("../models/User");
const Token = require("../models/Token");
const { checkNotAuthenticated } = require("../controllers/authController");
const sendMail = require("../utils/email");

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register");
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    if (req.body.password == req.body.password2) {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        req.flash("verify", "An account already exists with this email");
        return res.redirect("/auth/register");
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);
      user = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
      }).save();

      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const message = `${process.env.BASE_URL}/auth/verify/${user.id}/${token.token}`;
      await sendMail(user.email, "Verify email", message);
    } else {
      req.flash("info", "Password does not match");
      res.redirect("/auth/register");
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
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  (req, res) => res.redirect("/board/user/" + req.user.username)
);

router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Inavlid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id }, { $set: { isConfirmed: true } });
    await Token.findByIdAndDelete(token._id);

    req.flash("verify", "Successfully verified your account");
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
    req.flash("verify", "An error occured");
    res.redirect("/auth/register");
  }
});

router.post("/logout", (req, res) => {
  req.logOut();
  res.redirect("/auth/login");
});

module.exports = router;
