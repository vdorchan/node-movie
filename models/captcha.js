const mongoose = require('mongoose')

const captchaSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  captcha: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    index: {
      expires: 600
    },
    default: Date.now()
  }
})

module.exports = mongoose.model('Captcha', captchaSchema)