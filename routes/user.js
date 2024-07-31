const router = require('express').Router()
const authController = require('../controllers/auth')
const userController = require('../controllers/user')
const { authSignupInputMiddleware, authLoginInputMiddleware, updateProfileMiddleware } = require('../middlewares/InputValidatingMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')


router.get('/', userController.getUser)
router.get('/all', userController.getAllUsers)
router.post('/register', authSignupInputMiddleware, authController.register)
router.post('/login', authLoginInputMiddleware, authController.login)
router.patch('/update-profile', authMiddleware, updateProfileMiddleware, userController.updateProfile)

module.exports = router