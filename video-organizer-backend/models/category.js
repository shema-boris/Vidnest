const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
