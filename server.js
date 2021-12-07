require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const intializePassport = require("./middleware/passport-config");
intializePassport(passport);

// Views
const AuthView = require("./routes/auth");
const MainView = require("./routes/main");
const BoardsView = require("./routes/boards");

// App setup
const app = express();
const port = process.env.PORT || 5000;

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(
  session({
    secret: "secret key that cannot be guessed ever",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", AuthView);
app.use("/", MainView);
app.use("/", BoardsView);

// Connect to MongoDB & run server
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlparser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch((err) => console.log(err));


