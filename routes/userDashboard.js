const { Router } = require("express");
const { userAuthenticate } = require("../middlewares/authenticate");

const dashboardController = require("../controller/userDashboardController");

const router = new Router();

router.get("/", userAuthenticate, dashboardController.getDashboard);

module.exports = router;
