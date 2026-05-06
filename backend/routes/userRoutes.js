const express = require('express');
const {
  getUsers,
  deleteUser,
  updateProfile
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/profile', protect, updateProfile);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .delete(deleteUser);

module.exports = router;
