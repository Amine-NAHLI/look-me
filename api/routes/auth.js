const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, updateUserPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile routes
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);
router.put('/me/password', protect, updateUserPassword);

module.exports = router;
