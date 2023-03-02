const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  users: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true}
})

module.exports = User;