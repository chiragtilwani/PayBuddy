const Account = require("../models/Account")
const HttpError = require("../utilities/HttpError")

const getBalance = async (req, res,next) => {
    try {
        const account = await Account.findOne({ userId: req.user._id })
        if (account) {
            res.json({ balance: account.balance })
        } else {
            return next(new HttpError("Cannot find account associated with current user!", 404))
        }
    } catch (err) {
        return next(new HttpError("Something went wrong!", 500))
    }
}

module.exports={getBalance}