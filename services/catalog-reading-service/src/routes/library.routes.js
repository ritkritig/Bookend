const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/library.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', requireAuth, libraryController.getUserLibrary);
router.get('/user/:userId', libraryController.getUserLibrary);
router.post('/shelf', requireAuth, libraryController.setShelf);
router.patch('/progress', requireAuth, libraryController.updateProgress);
router.delete('/:bookId', requireAuth, libraryController.removeFromLibrary);

module.exports = router;
