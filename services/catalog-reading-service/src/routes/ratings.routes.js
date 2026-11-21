const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratings.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/', requireAuth, ratingsController.rateBook);

module.exports = router;
