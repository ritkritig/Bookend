const express = require('express');
const router = express.Router();
const adaptationsController = require('../controllers/adaptations.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth.middleware');

router.get('/', adaptationsController.getAdaptations);
router.get('/:id', optionalAuth, adaptationsController.getAdaptationById);
router.post('/:id/vote', requireAuth, adaptationsController.voteAdaptation);
router.post('/:id/rate', requireAuth, adaptationsController.rateAdaptation);

module.exports = router;
