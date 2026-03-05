const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  toEmail: String,
  message: String,
  actionRoute: String,
  time: {type: Date, default: Date.now},
  read: {type:Boolean, default:false}
})

module.exports = mongoose.model('Notification', notificationSchema)
