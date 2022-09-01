const { Router } = require('express')
const { adminAuthenticate } = require('../middlewares/authenticate')

const dashboardController = require('../controller/adminDashboardController')

const router = new Router()

router.get('/', adminAuthenticate, dashboardController.getDashboard)

module.exports = router
