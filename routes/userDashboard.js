const { Router } = require("express");
const { authenticate } = require("../middlewares/authenticate");

const dashboardController = require("../controller/userDashboardController");

const router = new Router();

router.get("/", authenticate, dashboardController.getDashboard);

router.get("/add-post", authenticate, dashboardController.getAddPost);

router.get("/edit-post/:id", authenticate, dashboardController.getEditPost);

router.get("/delete-post/:id", authenticate, dashboardController.deletePost);

router.post("/edit-post/:id", authenticate, dashboardController.editPost);

router.post("/add-post", authenticate, dashboardController.createdPost);

router.post("/image-upload", authenticate, dashboardController.uploadImage);

module.exports = router;
