const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    type: { type: String, enum: ['credit', 'debit'], required: true }
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)