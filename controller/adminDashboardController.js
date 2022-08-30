const fs = require("fs");

const multer = require("multer");
const shortId = require("shortid");
const sharp = require("sharp");
const appRoot = require("app-root-path");

const { formatDate } = require("../utils/jalali");
const { get500, get404 } = require("./errorController");
const { fileFilter } = require("../utils/multer");

exports.getDashboard = async (req, res) => {
  const page = +req.query.page || 1;
  const postPerPage = 2;
  try {
    const numberOfPosts = await Blog.find({
      user: req.user.id,
    }).countDocuments();
    const blogs = await Blog.find({ user: req.user.id })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);

    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );

    res.render("dashboard", {
      pageTitle: "مدیریت حساب کاربری",
      path: "/dashboard",
      fullname: req.user.fullname,
      blogs,
      formatDate,
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

exports.getAddPost = (req, res) => {
  res.render("addPost", {
    pageTitle: "ساخت پست جدید",
    path: "/dashboard/add-post",
    fullname: req.user.fullname,
  });
};

exports.getEditPost = async (req, res) => {
  const post = await Blog.findOne({ _id: req.params.id });

  if (!post) return get404(req, res);

  if (post.user.toString() != req.user._id) {
    return get404(req, res);
  } else {
    res.render("editPost", {
      pageTitle: "ویرایش پست ",
      path: "/dashboard/edit-post",
      fullname: req.user.fullname,
      post,
    });
  }
};

exports.editPost = async (req, res) => {
  const post = await Blog.findOne({ _id: req.params.id });

  const thumbnail = req.files ? req.files.thumbnail : {};
  const filename = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnail/${filename}`;

  try {
    const { title, status, body } = req.body;

    if (thumbnail.name) {
      await Blog.validation({ ...req.body, thumbnail });
    } else {
      Blog.validation({
        ...req.body,
        thumbnail: {
          name: "placeholder",
          size: 0,
          mimetype: "image/jpeg",
        },
      });
    }

    if (!post) return get404(req, res);

    if (post.user.toString() != req.user._id) {
      return get404(req, res);
    } else {
      if (thumbnail.name) {
        fs.unlink(
          `${appRoot}/public/uploads/humbnail/${post.thumbnail}`,
          async (err) => {
            if (err) console.log(err);
          }
        );
      }

      await sharp(thumbnail.data)
        .jpeg({ quality: 60 })
        .toFile(uploadPath)
        .catch((err) => console.log(err));
      post.title = title;
      post.status = status;
      post.body = body;
      post.thumbnail = thumbnail.name ? filename : post.thumbnail;
      await post.save();
      req.flash("success_msg", "پست شما با موفقیت ویرایش شد");

      return res.render("editPost", {
        pageTitle: "ویرایش پست ",
        path: "/dashboard/edit-post",
        fullname: req.user.fullname,
        post,
        message: req.flash("success_msg"),
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("editPost", {
      pageTitle: "ویرایش پست ",
      path: "/dashboard/edit-post",
      fullname: req.user.fullname,
      post,
      errors: err.errors,
    });
  }
};

exports.deletePost = async (req, res) => {
  const post = await Blog.findOne({ _id: req.params.id });
  try {
    if (!post) return get404(req, res);
    if (post.user.toString() != req.user._id) {
      return get404(req, res);
    } else {
      await Blog.findByIdAndDelete(req.params.id);
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};

exports.createdPost = async (req, res) => {
  const thumbnail = req.files ? req.files.thumbnail : {};
  const filename = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnail/${filename}`;
  try {
    req.body = { ...req.body, thumbnail };
    await Blog.validation(req.body);
    await sharp(thumbnail.data)
      .jpeg({ quality: 60 })
      .toFile(uploadPath)
      .catch((err) => console.log(err));
    await Blog.create({ ...req.body, user: req.user.id, thumbnail: filename });
    req.flash("success_msg", "پست شما با موفقیت ثبت شد");
    return res.render("addPost", {
      pageTitle: "ساخت پست جدید",
      path: "/dashboard/add-post",
      fullname: req.user.fullname,
      message: req.flash("success_msg"),
    });
  } catch (err) {
    console.log(err);
    return res.render("addPost", {
      pageTitle: "ساخت پست جدید",
      path: "/dashboard/add-post",
      fullname: req.user.fullname,
      errors: err.errors,
    });
  }
};

exports.uploadImage = (req, res) => {
  const upload = multer({
    limits: { fieldSize: 1000000 }, //4MG
    fileFilter: fileFilter,
  }).single("image");

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .send("حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد");
      }
      res.status(400).send(err);
    } else {
      if (req.file) {
        const fileName = `${shortId.generate()}_${req.file.originalname}`;
        await sharp(req.file.buffer)
          .jpeg({ quality: 60 })
          .toFile(`./public/uploads/${fileName}`)
          .catch((err) => console.log(err));
        res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
      } else {
        res.send("جهت آپلود باید عکسی انتخاب کنید");
      }
    }
  });
};
