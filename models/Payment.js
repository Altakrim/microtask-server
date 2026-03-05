const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  buyer_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  coins: Number,
  amount: Number,
  stripeSessionId: String,
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Payment', paymentSchema)
