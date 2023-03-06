const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction', {
  name: String,
  amount: Number,
  type: String,
  created_at: String,
  user: { type: mongoose.ObjectId, ref: 'User'},
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  transactions: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}
})

module.exports = Transaction;