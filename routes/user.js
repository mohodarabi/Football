const { Router } = require('express')

const userController = require('../controller/userController')
const { userAuthenticate, adminAuthenticate, } = require('../middlewares/authenticate')

const router = new Router()

router.get('/signin', userController.signin)

router.post('/signin', userController.loginHandler, userController.rememberMe)

router.get('/a/logout', adminAuthenticate, userController.logout)

router.get('/u/logout', userAuthenticate, userController.logout)

router.get('/signup', userController.signup)

router.post('/signup', userController.createdUser)

router.get('/forget-password', userController.forgetPassword)

router.post('/forget-password', userController.handleForgetPassword)

router.get('/reset-password/:token', userController.resetPassword)

router.post('/reset-password/:id', userController.handleResetPassword)

module.exports = router
