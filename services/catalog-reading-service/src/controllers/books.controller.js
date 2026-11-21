const db = require('../models/db');

exports.getBooks = (req, res) => {
  try {
    const { q, genre, sort = 'trending', limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (q) {
      const qLower = q.toLowerCase().trim();
      query += ' AND (LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(genres) LIKE ? OR LOWER(description) LIKE ?)';
      params.push(`%${qLower}%`, `%${qLower}%`, `%${qLower}%`, `%${qLower}%`);
    }

    if (genre && genre !== 'All') {
      query += ' AND LOWER(genres) LIKE ?';
      params.push(`%${genre.toLowerCase()}%`);
    }

    if (sort === 'rating') {
      query += ' ORDER BY average_rating DESC, ratings_count DESC';
    } else if (sort === 'year') {
      query += ' ORDER BY published_year DESC';
    } else if (sort === 'title') {
      query += ' ORDER BY title ASC';
    } else {
      // Default: trending / popularity
      query += ' ORDER BY ratings_count DESC, average_rating DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const books = db.prepare(query).all(...params);

    const formatted = books.map(b => ({
      ...b,
      genres: JSON.parse(b.genres)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('[CATALOG SERVICE] getBooks error:', err);
    res.status(500).json({ error: 'Internal error fetching books.' });
  }
};

exports.getBookById = (req, res) => {
  try {
    const { id } = req.params;
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    const adaptations = db.prepare('SELECT * FROM adaptations WHERE book_id = ?').all(id);

    let userReadingStatus = null;
    let userRating = null;

    if (req.user) {
      const userLibraryEntry = db.prepare('SELECT * FROM user_library WHERE user_id = ? AND book_id = ?').get(req.user.id, id);
      if (userLibraryEntry) {
        userReadingStatus = {
          shelf: userLibraryEntry.shelf,
          currentPage: userLibraryEntry.current_page,
          isFavorite: Boolean(userLibraryEntry.is_favorite),
          progressPercentage: Math.min(100, Math.round((userLibraryEntry.current_page / book.page_count) * 100)),
          completedAt: userLibraryEntry.completed_at
        };
      }

      const ratingEntry = db.prepare('SELECT rating, review_title, review_text FROM ratings_reviews WHERE user_id = ? AND book_id = ?').get(req.user.id, id);
      if (ratingEntry) {
        userRating = ratingEntry;
      }
    }

    res.json({
      ...book,
      genres: JSON.parse(book.genres),
      adaptations,
      userReadingStatus,
      userRating
    });
  } catch (err) {
    console.error('[CATALOG SERVICE] getBookById error:', err);
    res.status(500).json({ error: 'Internal error fetching book details.' });
  }
};

exports.getGenres = (req, res) => {
  try {
    const books = db.prepare('SELECT genres FROM books').all();
    const genreMap = {};

    for (const b of books) {
      const parsed = JSON.parse(b.genres);
      for (const g of parsed) {
        genreMap[g] = (genreMap[g] || 0) + 1;
      }
    }

    const sortedGenres = Object.entries(genreMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json(sortedGenres);
  } catch (err) {
    console.error('[CATALOG SERVICE] getGenres error:', err);
    res.status(500).json({ error: 'Internal error fetching genres.' });
  }
};

exports.getTrending = (req, res) => {
  try {
    const books = db.prepare(`
      SELECT * FROM books
      ORDER BY ratings_count DESC, average_rating DESC
      LIMIT 6
    `).all();

    res.json(books.map(b => ({ ...b, genres: JSON.parse(b.genres) })));
  } catch (err) {
    console.error('[CATALOG SERVICE] getTrending error:', err);
    res.status(500).json({ error: 'Internal error fetching trending books.' });
  }
};
