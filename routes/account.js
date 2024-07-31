const authMiddleware = require("../middlewares/authMiddleware")
const accountController = require("../controllers/account")

const router = require("express").Router()

router.get('/balance', authMiddleware, accountController.getBalance)
router.post('/transfer', authMiddleware, accountController.transfer)
router.post('/request-money', authMiddleware, accountController.requestMoney)

module.exports = router