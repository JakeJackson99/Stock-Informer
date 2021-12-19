const router = require("express").Router();
const User = require("../models/User");

const { checkAuthenticated } = require("../controllers/authController");

router.get("/user/:username", checkAuthenticated, async (req, res) => {
  user_board = await User.findOne({ username: req.params.username });

  res.render("dashboard", { user_board: user_board, current_user: req.user });
});

router.get("/new-item", checkAuthenticated, (req, res) => {
  res.render("new_item");
});

router.post("/new_item", checkAuthenticated, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          items: {
            name: req.body.name,
            stockCount: req.body.stock_count,
          },
        },
      },
      { new: true, runValidators: true }
    );
    res.redirect("/user/" + req.user.username);
  } catch (error) {
    console.log(error);
    res.redirect("/user/" + req.user.username);
  }
});

router.delete("/:item_name", checkAuthenticated, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { items: { name: req.params.item_name } } }
    );
    res.redirect("/dashboard/" + req.user.username);
  } catch (error) {
    console.log(error);
    res.redirect("/dashboard/" + req.user.username);
  }
});



module.exports = router;
