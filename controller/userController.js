const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../model/User");
const { sendMail } = require("../utils/mailer");
const { log } = require("console");

exports.signin = (req, res) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  res.render("signin", {
    pageTitle: "ورود به حساب کاربری",
    path: "/signin",
    message: req.flash("success_msg"),
    error: req.flash("error"),
  });
};

exports.loginHandler = async (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/user/signin",
    failureFlash: true,
  })(req, res, next);
};

exports.rememberMe = (req, res) => {
  if (req.body.rememberMe) {
    req.session.cookie.originalMaxAge = 7 * 60 * 60 * 1000;
  } else {
    req.session.cookie.expire = null;
  }

  res.redirect("/dashboard");
};

exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      log(err);
    }
    req.flash("success_msg", "شما با موفقیت خارج شدید");
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.redirect("/user/signin");
  });
};

exports.signup = (req, res) => {
  res.render("signup", {
    pageTitle: "ساخت حساب کاربری",
    path: "/signup",
  });
};

exports.createdUser = async (req, res) => {
  try {
    await User.validation(req.body);
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.render("signup", {
        pageTitle: "ساخت حساب کاربری",
        path: "/signup",
        errors: ["کاربری با این ایمیل وجود دارد"],
      });
    }
    await User.create({ fullname, email, password });

    sendMail(
      email,
      fullname,
      "خوش آمدی به وبلاگ ما",
      "خیلی خوشحالیم که به جمع ما وبلاگرهای خفن ملحق شدی"
    );

    req.flash("success_msg", "حساب کاربری با موفقیت ایجاد شد");
    res.redirect("/user/signin");
  } catch (err) {
    return res.render("signup", {
      pageTitle: "ساخت حساب کاربری",
      path: "/signup",
      errors: err.errors,
    });
  }
};

exports.forgetPassword = (req, res) => {
  res.render("forgetPass", {
    pageTitle: "فراموشی رمز عبور",
    path: "/signin",
    message: req.flash("success_msg"),
    error: req.flash("error"),
  });
};

exports.handleForgetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    req.flash("error", "کاربری با این ایمیل در پایگاه داده ثبت نشده");

    return res.render("forgetPass", {
      pageTitle: "فراموشی رمز عبور",
      path: "/signin",
      message: req.flash("success_msg"),
      error: req.flash("error"),
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });
  const resetLink = `http://localhost:3000/user/reset-password/${token}`;

  sendMail(
    user.email,
    user.fullname,
    "فراموشی رمز عبور",
    `
        جهت تغییر رمز عبور فعلی رو لینک زیر کلیک کنید
        <a href="${resetLink}">لینک تغییر رمز عبور</a>
    `
  );

  req.flash("success_msg", "ایمیل حاوی لینک با موفقیت ارسال شد");

  res.render("forgetPass", {
    pageTitle: "فراموشی رمز عبور",
    path: "/signin",
    message: req.flash("success_msg"),
    error: req.flash("error"),
  });
};

exports.resetPassword = (req, res) => {
  const token = req.params.token;

  let decodeToken;

  try {
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);
    if (!decodeToken) {
      res.redirect("/404");
    }
  }

  res.render("resetPass", {
    pageTitle: "تغییر رمز عبور",
    path: "/signin",
    message: req.flash("success_msg"),
    error: req.flash("error"),
    userId: decodeToken.userId,
  });
};

exports.handleResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "کلمه های عبور یاکسان نیستند");

    return res.render("resetPass", {
      pageTitle: "تغییر پسورد",
      path: "/signin",
      message: req.flash("success_msg"),
      error: req.flash("error"),
      userId: req.params.id,
    });
  }

  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    return res.redirect("/404");
  }

  user.password = password;
  await user.save();

  req.flash("success_msg", "پسورد شما با موفقیت بروزرسانی شد");
  res.redirect("/user/signin");
};
