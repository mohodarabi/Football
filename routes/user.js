const { Router } = require("express");

const userController = require("../controller/userController");
const { authenticate } = require("../middlewares/authenticate");

const router = new Router();

router.get("/signin", userController.signin);

router.post("/signin", userController.loginHandler, userController.rememberMe);

router.get("/logout", authenticate, userController.logout);

router.get("/signup", userController.signup);

router.post("/signup", userController.createdUser);

router.get("/forget-password", userController.forgetPassword);

router.post("/forget-password", userController.handleForgetPassword);

router.get("/reset-password/:token", userController.resetPassword);

router.post("/reset-password/:id", userController.handleResetPassword);

module.exports = router;
