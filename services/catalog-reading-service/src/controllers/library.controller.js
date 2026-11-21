const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { publishEvent } = require('../events/publisher');

exports.getUserLibrary = (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { shelf } = req.query;

    let query = `
      SELECT 
        ul.*,
        b.title,
        b.author,
        b.cover_url,
        b.page_count,
        b.genres,
        b.average_rating,
        rr.rating as user_rating,
        rr.review_text as user_review
      FROM user_library ul
      JOIN books b ON ul.book_id = b.id
      LEFT JOIN ratings_reviews rr ON (rr.user_id = ul.user_id AND rr.book_id = ul.book_id)
      WHERE ul.user_id = ?
    `;
    const params = [userId];

    if (shelf && shelf !== 'all') {
      if (shelf === 'favorites') {
        query += ' AND ul.is_favorite = 1';
      } else {
        query += ' AND ul.shelf = ?';
        params.push(shelf);
      }
    }

    query += ' ORDER BY ul.updated_at DESC';

    const items = db.prepare(query).all(...params);

    const formatted = items.map(item => {
      const progressPercentage = item.page_count > 0 
        ? Math.min(100, Math.round((item.current_page / item.page_count) * 100))
        : 0;

      return {
        id: item.id,
        userId: item.user_id,
        bookId: item.book_id,
        shelf: item.shelf,
        currentPage: item.current_page,
        isFavorite: Boolean(item.is_favorite),
        startedAt: item.started_at,
        completedAt: item.completed_at,
        updatedAt: item.updated_at,
        progressPercentage,
        book: {
          id: item.book_id,
          title: item.title,
          author: item.author,
          coverUrl: item.cover_url,
          pageCount: item.page_count,
          genres: JSON.parse(item.genres),
          averageRating: item.average_rating
        },
        userRating: item.user_rating,
        userReview: item.user_review
      };
    });

    const stats = {
      total: formatted.length,
      wantToRead: formatted.filter(i => i.shelf === 'want_to_read').length,
      currentlyReading: formatted.filter(i => i.shelf === 'currently_reading').length,
      completed: formatted.filter(i => i.shelf === 'completed').length,
      favorites: formatted.filter(i => i.isFavorite).length
    };

    res.json({ stats, items: formatted });
  } catch (err) {
    console.error('[CATALOG SERVICE] getUserLibrary error:', err);
    res.status(500).json({ error: 'Internal error fetching user library.' });
  }
};

exports.setShelf = (req, res) => {
  try {
    const { bookId, shelf, isFavorite } = req.body;
    const userId = req.user.id;

    if (!bookId || !shelf) {
      return res.status(400).json({ error: 'bookId and shelf are required.' });
    }

    const validShelves = ['want_to_read', 'currently_reading', 'completed'];
    if (!validShelves.includes(shelf)) {
      return res.status(400).json({ error: `Invalid shelf. Allowed: ${validShelves.join(', ')}` });
    }

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    const existing = db.prepare('SELECT * FROM user_library WHERE user_id = ? AND book_id = ?').get(userId, bookId);
    const now = new Date().toISOString();
    let completedAt = null;
    let startedAt = null;
    let currentPage = existing ? existing.current_page : 0;
    const favValue = isFavorite !== undefined ? (isFavorite ? 1 : 0) : (existing ? existing.is_favorite : 0);

    if (shelf === 'completed') {
      completedAt = now;
      currentPage = book.page_count; // Auto-fill pages on completion
    } else if (shelf === 'currently_reading') {
      startedAt = existing && existing.started_at ? existing.started_at : now;
    }

    if (existing) {
      db.prepare(`
        UPDATE user_library
        SET shelf = ?, current_page = ?, is_favorite = ?, completed_at = COALESCE(?, completed_at), started_at = COALESCE(?, started_at), updated_at = ?
        WHERE id = ?
      `).run(shelf, currentPage, favValue, completedAt, startedAt, now, existing.id);
    } else {
      const entryId = `lib_${uuidv4().substring(0, 8)}`;
      db.prepare(`
        INSERT INTO user_library (id, user_id, book_id, shelf, current_page, is_favorite, started_at, completed_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(entryId, userId, bookId, shelf, currentPage, favValue, startedAt, completedAt, now);
    }

    // Publish event: book.shelf_updated
    publishEvent('book.shelf_updated', 'book.shelf_updated', {
      userId,
      bookId,
      shelf,
      title: book.title,
      author: book.author,
      genres: JSON.parse(book.genres)
    });

    // If marked completed, publish domain event: book.completed
    if (shelf === 'completed') {
      const userRatingEntry = db.prepare('SELECT rating FROM ratings_reviews WHERE user_id = ? AND book_id = ?').get(userId, bookId);
      publishEvent('book.completed', 'book.completed', {
        userId,
        bookId,
        title: book.title,
        author: book.author,
        genres: JSON.parse(book.genres),
        pageCount: book.page_count,
        rating: userRatingEntry ? userRatingEntry.rating : null,
        completedAt: now
      });
    }

    res.json({
      message: `Book moved to '${shelf}'.`,
      bookId,
      shelf,
      isFavorite: Boolean(favValue),
      currentPage,
      progressPercentage: Math.min(100, Math.round((currentPage / book.page_count) * 100))
    });
  } catch (err) {
    console.error('[CATALOG SERVICE] setShelf error:', err);
    res.status(500).json({ error: 'Internal error updating shelf.' });
  }
};

exports.updateProgress = (req, res) => {
  try {
    const { bookId, currentPage } = req.body;
    const userId = req.user.id;

    if (!bookId || currentPage === undefined) {
      return res.status(400).json({ error: 'bookId and currentPage are required.' });
    }

    const pageNum = parseInt(currentPage, 10);
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    const existing = db.prepare('SELECT * FROM user_library WHERE user_id = ? AND book_id = ?').get(userId, bookId);
    const now = new Date().toISOString();
    const isCompleted = pageNum >= book.page_count;
    const newShelf = isCompleted ? 'completed' : 'currently_reading';

    if (existing) {
      db.prepare(`
        UPDATE user_library
        SET current_page = ?, shelf = ?, completed_at = CASE WHEN ? = 1 THEN ? ELSE completed_at END, updated_at = ?
        WHERE id = ?
      `).run(pageNum, newShelf, isCompleted ? 1 : 0, isCompleted ? now : null, now, existing.id);
    } else {
      const entryId = `lib_${uuidv4().substring(0, 8)}`;
      db.prepare(`
        INSERT INTO user_library (id, user_id, book_id, shelf, current_page, is_favorite, started_at, completed_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(entryId, userId, bookId, newShelf, pageNum, 0, now, isCompleted ? now : null, now);
    }

    const progressPercentage = Math.min(100, Math.round((pageNum / book.page_count) * 100));

    // Publish event: reading.progress.updated
    publishEvent('reading.progress.updated', 'reading.progress.updated', {
      userId,
      bookId,
      title: book.title,
      author: book.author,
      currentPage: pageNum,
      totalPages: book.page_count,
      progressPercentage
    });

    // If reached 100%, trigger book.completed event
    if (isCompleted && (!existing || existing.shelf !== 'completed')) {
      const userRatingEntry = db.prepare('SELECT rating FROM ratings_reviews WHERE user_id = ? AND book_id = ?').get(userId, bookId);
      publishEvent('book.completed', 'book.completed', {
        userId,
        bookId,
        title: book.title,
        author: book.author,
        genres: JSON.parse(book.genres),
        pageCount: book.page_count,
        rating: userRatingEntry ? userRatingEntry.rating : null,
        completedAt: now
      });
    }

    res.json({
      message: 'Reading progress updated.',
      bookId,
      currentPage: pageNum,
      totalPages: book.page_count,
      progressPercentage,
      shelf: newShelf
    });
  } catch (err) {
    console.error('[CATALOG SERVICE] updateProgress error:', err);
    res.status(500).json({ error: 'Internal error updating reading progress.' });
  }
};

exports.removeFromLibrary = (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    db.prepare('DELETE FROM user_library WHERE user_id = ? AND book_id = ?').run(userId, bookId);

    res.json({ message: 'Removed from personal library.', bookId });
  } catch (err) {
    console.error('[CATALOG SERVICE] removeFromLibrary error:', err);
    res.status(500).json({ error: 'Internal error removing book from library.' });
  }
};
