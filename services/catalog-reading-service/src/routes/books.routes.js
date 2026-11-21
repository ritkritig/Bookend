const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const ratingsController = require('../controllers/ratings.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', booksController.getBooks);
router.get('/genres', booksController.getGenres);
router.get('/trending', booksController.getTrending);
router.get('/:id', optionalAuth, booksController.getBookById);
router.get('/:id/reviews', ratingsController.getBookReviews);

module.exports = router;
