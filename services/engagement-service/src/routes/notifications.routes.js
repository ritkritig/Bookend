const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', requireAuth, notificationsController.getNotifications);
router.patch('/:id/read', requireAuth, notificationsController.markAsRead);
router.post('/mark-all-read', requireAuth, notificationsController.markAllRead);

module.exports = router;
