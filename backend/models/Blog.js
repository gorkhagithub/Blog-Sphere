const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  thumbnail: {
    type: String,
    default: 'no-photo.jpg'
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Create slug from title
blogSchema.pre('save', async function() {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9 -]/g, '').replace(/\s+/g, '-');
  }
});

module.exports = mongoose.model('Blog', blogSchema);
