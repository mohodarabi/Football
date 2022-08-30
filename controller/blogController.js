const Yup = require("yup");
const captchapng = require("captchapng");

const Blog = require("../model/Blog");
const { formatDate } = require("../utils/jalali");
const { get500, get404 } = require("./errorController");
const { truncate } = require("../utils/helpers");
const { sendMail } = require("../utils/mailer");

let CAPTCHA_NUM;

exports.getIndex = async (req, res) => {
  const page = +req.query.page || 1;
  const postPerPage = 2;
  try {
    const numberOfPosts = await Blog.find({
      status: "public",
    }).countDocuments();
    const posts = await Blog.find({ status: "public" })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);
    res.render("index", {
      pageTitle: "صفحه ی اصلی",
      path: "/",
      posts,
      formatDate,
      truncate,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: postPerPage * page < numberOfPosts,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfPosts / postPerPage),
    });
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id }).populate("user");

    if (!post) get404(req, res);

    res.render("post", {
      pageTitle: post.title,
      path: `/post/${post.title}`,
      post,
      formatDate,
    });
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};

exports.getContact = (req, res) => {
  res.render("contact", {
    pageTitle: "تماس باما",
    path: "/contact",
    message: req.flash("success_msg"),
    error: req.flash("error"),
    // errors: err.errors,
  });
};

exports.contactHandler = async (req, res) => {
  const { fullname, email, message, captcha } = req.body;

  const schema = Yup.object().shape({
    fullname: Yup.string().required("نام و نام خانوادگی الزامی می باشد"),
    email: Yup.string()
      .email("آدرس ایمیل صحیح نیست")
      .required("آدرس ایمیل الزامی می باشد"),
    message: Yup.string().required("پیام اصلی الزامی می باشد"),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });

    if (parseInt(captcha) === CAPTCHA_NUM) {
      sendMail(email, fullname, "پیام از طرف وبلاگ", message);
      req.flash("success_msg", "پیام شما با موفقیت ارسال شد");

      return res.render("contact", {
        pageTitle: "تماس باما",
        path: "/contact",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        errors: err.errors,
      });
    }

    req.flash("error", "کد امنیتی صحیح نیست");

    res.render("contact", {
      pageTitle: "تماس باما",
      path: "/contact",
      message: req.flash("success_msg"),
      error: req.flash("error"),
      errors: err.errors,
    });
  } catch (err) {
    res.render("contact", {
      pageTitle: "تماس باما",
      path: "/contact",
      message: req.flash("success_msg"),
      error: req.flash("error"),
      errors: err.errors,
    });
  }
};

exports.getCaptcha = (req, res) => {
  CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
  const p = new captchapng(80, 30, CAPTCHA_NUM);
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);

  const img = p.getBase64();
  const imgBase64 = Buffer.from(img, "base64");

  res.send(imgBase64);
};

exports.handleSearch = async (req, res) => {
  const page = +req.query.page || 1;
  const postPerPage = 5;

  try {
    const numberOfPosts = await Blog.find({
      status: "public",
      $text: { $search: req.body.search },
    }).countDocuments();

    const posts = await Blog.find({
      status: "public",
      $text: { $search: req.body.search },
    })
      .sort({
        createdAt: "desc",
      })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);

    res.render("index", {
      pageTitle: "نتایج جستجوی شما",
      path: "/",
      posts,
      formatDate,
      truncate,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: postPerPage * page < numberOfPosts,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfPosts / postPerPage),
    });
    //? Smooth Scrolling
  } catch (err) {
    console.log(err);
    res.render("errors/500", {
      pageTitle: "خطای سرور | 500",
      path: "/404",
    });
  }
};
