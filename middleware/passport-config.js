const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    try {
      if (user.isConfirmed == true) {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          done(null, false, { message: "Incorrect password" });
        }
      } else {
        done(null, false, { message: "User not confirmed" });
      }
    } catch (error) {
      console.log(error);
      return done(error);
    }
  };

  passport.use(new LocalStrategy(authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    return done(null, user);
  });
}

module.exports = initialize;
