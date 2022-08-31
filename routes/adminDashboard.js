const { Router } = require("express");
const { authenticate } = require("../middlewares/authenticate");

const dashboardController = require("../controller/adminDashboardController");

const router = new Router();

router.get("/", authenticate, dashboardController.getDashboard);

module.exports = router;
