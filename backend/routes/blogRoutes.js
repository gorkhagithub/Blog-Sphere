const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// Include other resource routers
const commentRouter = require('./commentRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:blogId/comments', commentRouter);
router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route('/:id/like').put(protect, likeBlog);

module.exports = router;
