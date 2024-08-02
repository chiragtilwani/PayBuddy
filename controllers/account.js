const mongoose = require("mongoose")
const Account = require("../models/Account")
const HttpError = require("../utilities/HttpError")
const { sendNotification } = require("../utilities/helperFunctions")
const Transaction = require("../models/Transaction")

const getBalance = async (req, res, next) => {
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

const transfer = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    const { amount, receiverId } = req.body

    const sendersAcc = await Account.findOne({ userId: req.user._id }).session(session)

    if (!sendersAcc) {
        await session.abortTransaction()
        return next(new HttpError("Something went wrong!", 400))
    }

    if (sendersAcc.balance < amount) {
        await session.abortTransaction()
        await Transaction.create({ userId: req.user._id, participantId: receiverId, amount, status: 'failed', type: 'debit' })
        return next(new HttpError("Insufficient balance!", 400))
    }

    const receiverAcc = await Account.findOne({ userId: receiverId }).session(session)

    if (!receiverAcc) {
        await session.abortTransaction()
        return next(new HttpError("Invalid Account!", 400))
    }

    await Account.updateOne({ userId: req.user._id }, { $inc: { balance: -amount } }).session(session)
    await Account.updateOne({ userId: receiverId }, { $inc: { balance: amount } }).session(session)

    await session.commitTransaction()
    
    await Transaction.create({ userId: req.user._id, participantId: receiverId, amount, status: 'completed', type: 'debit' })
    await Transaction.create({ userId: receiverId, participantId: req.user._id, amount, status: 'completed', type: 'credit' })
    res.json({ message: "Transfer Successful" }).status(200)
}

const requestMoney = async (req, res, next) => {
    const { requestTo, amount } = req.body

    const requestedUser = await Account.findOne({ userId: requestTo })
    if (!requestedUser) {
        return next(new HttpError("User not found!", 404))
    }

    sendNotification(requestTo, `${req.user.username} has requested ${amount}`)

    res.json({ message: "Request Sent" }).status(200)
}
//if user approves the request, the amount will be transferred to the user who requested the money using transfer route

const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 })
        if (transactions.length === 0) {
            return next(new HttpError("No transactions found!", 404))
        }
        res.json({ transactions })
    } catch (err) {
        return next(new HttpError("Something went wrong!", 500))
    }
}
module.exports = { getBalance, transfer, requestMoney, getTransactions }