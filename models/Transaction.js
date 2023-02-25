const mongoose = require('mongoose');

const Transaction = mongoose.model('Transaction', {
  name: String,
  amount: String,
  type: String,
  created_at: String,
  transactions: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}
})

module.exports = Transaction;