const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', userController.getAllUsers);
router.patch('/profile', requireAuth, userController.updateProfile);
router.get('/:id', userController.getUserById);

module.exports = router;
