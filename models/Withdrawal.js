const mongoose = require('mongoose')

const withdrawalSchema = new mongoose.Schema({
  worker_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  coins: Number,
  amount: Number,
  payment_system: String,
  account_number: String,
  status: {type:String, enum:['pending','approved','rejected'], default:'pending'},
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Withdrawal', withdrawalSchema)
