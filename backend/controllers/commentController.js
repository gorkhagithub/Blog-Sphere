const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// @desc    Get comments for a blog
// @route   GET /api/blogs/:blogId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate({
        path: 'author',
        select: 'name profilePicture'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment
// @route   POST /api/blogs/:blogId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    req.body.blog = req.params.blogId;
    req.body.author = req.user.id;

    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const comment = await Comment.create(req.body);

    const populatedComment = await Comment.findById(comment._id).populate({
      path: 'author',
      select: 'name profilePicture'
    });

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Make sure user is comment owner or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'User not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
