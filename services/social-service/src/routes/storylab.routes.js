const express = require('express');
const router = express.Router();
const storylabController = require('../controllers/storylab.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, storylabController.getPosts);
router.post('/', requireAuth, storylabController.createPost);
router.get('/:id', optionalAuth, storylabController.getPostById);
router.put('/:id', requireAuth, storylabController.updatePost);
router.delete('/:id', requireAuth, storylabController.deletePost);

router.post('/:id/like', requireAuth, storylabController.toggleLike);
router.post('/:id/bookmark', requireAuth, storylabController.toggleBookmark);
router.get('/:id/comments', storylabController.getComments);
router.post('/:id/comments', requireAuth, storylabController.addComment);
router.post('/:id/report', requireAuth, storylabController.reportPost);

module.exports = router;
