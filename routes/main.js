const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const user = await new User({
      username: "Jake1",
      email: "jake1@mail.com",
      password: "123456",
      item: {
        name: "Cheese",
        stockCount: 22,
      },
    });
    await user.save();
    console.log(user);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

router.get("/dashboard/:username", checkAuthenticated, async (req, res) => {
  user_board = await User.findOne({ username: req.params.username });

  res.render("dashboard", { user_board: user_board, current_user: req.user });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
