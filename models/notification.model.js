const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
 
  notification: {
    type: String,
    required: true,
    trim: true
  },

}, {timestamps: true});

module.exports = mongoose.model('Notification', notificationSchema);
