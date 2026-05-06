const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add some text'],
    maxlength: 500
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: 'Blog',
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
