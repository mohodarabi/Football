const path = require("path");

const express = require("express");
const passport = require("passport");
const debug = require("debug")("weblog-project");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const connectDB = require("./config/database");
const winston = require("./config/winston");

const app = express();

//* bodyParser------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//* express fileupload middleware
app.use(fileupload());

//* load config----------------------------------------
dotenv.config({ path: "./config/config.env" });

//* morgan logs----------------------------------------
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined", { stream: winston.streams }));
}

//* passport configuration-----------------------------
require("./config/passsport");

//* sessions
app.use(
  session({
    secret: process.env.SECRET_PASSWORD,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//* passport-------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

//* flash
app.use(flash());

//* connection to database-----------------------------
connectDB();
debug("connceted to database");

//* static folder--------------------------------------
app.use(express.static(path.join(__dirname, "public")));

//* routes---------------------------------------------
app.use("/user", require("./routes/user"));
app.use("/dashboard/user", require("./routes/userDashboard"));
app.use("/dashboard/admin", require("./routes/adminDashboard"));
app.use("/", require("./routes/index"));

//* 404 page not found --------------------------------
app.use(require("./controller/errorController").get404);

//* view engine----------------------------------------
app.set("view engine", "ejs");
app.set("views", "views");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`server is running ${process.env.NODE_ENV} mode on port ${PORT}`);
});
