const { Router } = require("express");

const blogController = require("../controller/blogController");

const router = new Router();

router.get("/", blogController.getIndex);

router.get("/post/:id", blogController.getSinglePost);

router.get("/contact", blogController.getContact);

router.post("/contact", blogController.contactHandler);

router.get("/captcha.png", blogController.getCaptcha);

router.post("/search", blogController.handleSearch);

module.exports = router;
