const router = require('express').Router()
const authController = require('../controllers/auth')
const {authSignupInputMiddleware,authLoginInputMiddleware} = require('../middlewares/authInputMiddleware')


router.post('/register', authSignupInputMiddleware, authController.register)
router.post('/login', authLoginInputMiddleware, authController.login)

module.exports = router