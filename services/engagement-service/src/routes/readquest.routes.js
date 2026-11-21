const express = require('express');
const router = express.Router();
const readquestController = require('../controllers/readquest.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth.middleware');

router.get('/dashboard', requireAuth, readquestController.getDashboard);
router.get('/challenges', optionalAuth, readquestController.getChallenges);
router.get('/achievements', optionalAuth, readquestController.getAchievements);
router.post('/events', readquestController.receiveEventWebhook);

module.exports = router;
