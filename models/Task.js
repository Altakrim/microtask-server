const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: String,
  detail: String,
  required_workers: Number,
  payable_amount: Number,
  total_payable: Number,
  completion_date: Date,
  submission_info: String,
  task_image_url: String,
  buyer_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Task', taskSchema)
