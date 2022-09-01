const { Router } = require('express')

const footballController = require('../controller/footballController')

const router = new Router()

router.get('/', footballController.getIndex)

module.exports = router
