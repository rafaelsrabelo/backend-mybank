const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction', {
  name: String,
  amount: Number,
  type: String,
  created_at: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = Transaction;