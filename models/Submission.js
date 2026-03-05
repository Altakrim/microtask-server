const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
  task_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
  task_title: String,
  payable_amount: Number,
  worker_email: String,
  worker_name: String,
  buyer_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  buyer_name: String,
  buyer_email: String,
  submission_details: String,
  status: {type:String, enum:['pending','approved','rejected'], default:'pending'},
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Submission', submissionSchema)
