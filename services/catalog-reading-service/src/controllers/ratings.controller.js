const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { publishEvent } = require('../events/publisher');

exports.rateBook = (req, res) => {
  try {
    const { bookId, rating, reviewTitle, reviewText } = req.body;
    const userId = req.user.id;

    if (!bookId || !rating) {
      return res.status(400).json({ error: 'bookId and rating (1-5) are required.' });
    }

    const ratingVal = parseInt(rating, 10);
    if (ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    const existing = db.prepare('SELECT * FROM ratings_reviews WHERE user_id = ? AND book_id = ?').get(userId, bookId);

    if (existing) {
      db.prepare(`
        UPDATE ratings_reviews
        SET rating = ?, review_title = ?, review_text = ?, created_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(ratingVal, reviewTitle || null, reviewText || null, existing.id);
    } else {
      const entryId = `rev_${uuidv4().substring(0, 8)}`;
      db.prepare(`
        INSERT INTO ratings_reviews (id, user_id, book_id, rating, review_title, review_text)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(entryId, userId, bookId, ratingVal, reviewTitle || null, reviewText || null);
    }

    // Recalculate book aggregate rating
    const agg = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count
      FROM ratings_reviews
      WHERE book_id = ?
    `).get(bookId);

    const newAvg = parseFloat(agg.avg_rating.toFixed(2));
    const newCount = agg.count;

    db.prepare(`
      UPDATE books
      SET average_rating = ?, ratings_count = ?
      WHERE id = ?
    `).run(newAvg, newCount, bookId);

    // Publish event: book.rated
    publishEvent('book.rated', 'book.rated', {
      userId,
      bookId,
      rating: ratingVal,
      reviewText: reviewText || null,
      title: book.title,
      author: book.author,
      genres: JSON.parse(book.genres)
    });

    res.json({
      message: 'Rating and review recorded successfully.',
      bookId,
      userRating: ratingVal,
      bookAverageRating: newAvg,
      bookRatingsCount: newCount
    });
  } catch (err) {
    console.error('[CATALOG SERVICE] rateBook error:', err);
    res.status(500).json({ error: 'Internal error rating book.' });
  }
};

exports.getBookReviews = (req, res) => {
  try {
    const { id } = req.params;

    const reviews = db.prepare(`
      SELECT 
        id, user_id, rating, review_title, review_text, created_at
      FROM ratings_reviews
      WHERE book_id = ?
      ORDER BY created_at DESC
    `).all(id);

    res.json(reviews);
  } catch (err) {
    console.error('[CATALOG SERVICE] getBookReviews error:', err);
    res.status(500).json({ error: 'Internal error fetching reviews.' });
  }
};
