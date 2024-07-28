const authMiddleware = require("../middlewares/authMiddleware")
const accountController = require("../controllers/account")

const router = require("express").Router()

router.get('/balance', authMiddleware, accountController.getBalance)

module.exports = router