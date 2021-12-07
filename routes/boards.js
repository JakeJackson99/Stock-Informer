const router = require("express").Router();
const User = require("../models/User");

router.post("/newboard", checkAuthenticated, async (req, res) => {
  console.log(req.user.id)
  try {
    const new_items = {
      name: req.body.name,
      stockCount: req.body.stock_count
    }
    await User.updateOne(
      { _id: req.user.id },
      { $push: { items: new_items } },
      { new: true, runValidators: true })
    res.redirect("/dashboard/" + req.user.username)
  } catch (error) {
    console.log(error);
    res.redirect("/dashboard/" + req.user.username)
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
