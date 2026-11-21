const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { publishEvent } = require('../events/publisher');

exports.getAdaptations = (req, res) => {
  try {
    const { type } = req.query;
    let query = `
      SELECT 
        a.*,
        b.title as book_title,
        b.author as book_author,
        b.cover_url as book_cover_url,
        b.average_rating as book_rating
      FROM adaptations a
      JOIN books b ON a.book_id = b.id
    `;
    const params = [];

    if (type && type !== 'All') {
      query += ' WHERE a.type = ?';
      params.push(type);
    }

    query += ' ORDER BY (a.book_votes + a.screen_votes) DESC, a.release_year DESC';

    const adaptations = db.prepare(query).all(...params);

    const formatted = adaptations.map(a => {
      const totalVotes = a.book_votes + a.screen_votes;
      const bookPercentage = totalVotes > 0 ? Math.round((a.book_votes / totalVotes) * 100) : 50;
      const screenPercentage = totalVotes > 0 ? 100 - bookPercentage : 50;

      return {
        ...a,
        totalVotes,
        bookPercentage,
        screenPercentage
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('[CATALOG SERVICE] getAdaptations error:', err);
    res.status(500).json({ error: 'Internal error fetching adaptations.' });
  }
};

exports.getAdaptationById = (req, res) => {
  try {
    const { id } = req.params;
    const adaptation = db.prepare(`
      SELECT 
        a.*,
        b.title as book_title,
        b.author as book_author,
        b.cover_url as book_cover_url,
        b.average_rating as book_rating,
        b.description as book_description,
        b.genres as book_genres
      FROM adaptations a
      JOIN books b ON a.book_id = b.id
      WHERE a.id = ?
    `).get(id);

    if (!adaptation) {
      return res.status(404).json({ error: 'Adaptation not found.' });
    }

    const totalVotes = adaptation.book_votes + adaptation.screen_votes;
    const bookPercentage = totalVotes > 0 ? Math.round((adaptation.book_votes / totalVotes) * 100) : 50;
    const screenPercentage = totalVotes > 0 ? 100 - bookPercentage : 50;

    let userVote = null;
    let userRating = null;

    if (req.user) {
      const voteRow = db.prepare('SELECT preferred FROM adaptation_votes WHERE user_id = ? AND adaptation_id = ?').get(req.user.id, id);
      if (voteRow) userVote = voteRow.preferred;

      const ratingRow = db.prepare('SELECT faithfulness, casting, story, overall FROM adaptation_ratings WHERE user_id = ? AND adaptation_id = ?').get(req.user.id, id);
      if (ratingRow) userRating = ratingRow;
    }

    res.json({
      ...adaptation,
      book_genres: JSON.parse(adaptation.book_genres),
      totalVotes,
      bookPercentage,
      screenPercentage,
      userVote,
      userRating
    });
  } catch (err) {
    console.error('[CATALOG SERVICE] getAdaptationById error:', err);
    res.status(500).json({ error: 'Internal error fetching adaptation details.' });
  }
};

exports.voteAdaptation = (req, res) => {
  try {
    const { id } = req.params;
    const { preferred } = req.body; // 'book' or 'screen'
    const userId = req.user.id;

    if (!['book', 'screen'].includes(preferred)) {
      return res.status(400).json({ error: "Vote must be either 'book' or 'screen'." });
    }

    const adaptation = db.prepare('SELECT * FROM adaptations WHERE id = ?').get(id);
    if (!adaptation) {
      return res.status(404).json({ error: 'Adaptation not found.' });
    }

    const existingVote = db.prepare('SELECT * FROM adaptation_votes WHERE user_id = ? AND adaptation_id = ?').get(userId, id);

    if (existingVote) {
      if (existingVote.preferred !== preferred) {
        // Change vote
        if (preferred === 'book') {
          db.prepare('UPDATE adaptations SET book_votes = book_votes + 1, screen_votes = MAX(0, screen_votes - 1) WHERE id = ?').run(id);
        } else {
          db.prepare('UPDATE adaptations SET screen_votes = screen_votes + 1, book_votes = MAX(0, book_votes - 1) WHERE id = ?').run(id);
        }
        db.prepare('UPDATE adaptation_votes SET preferred = ? WHERE id = ?').run(preferred, existingVote.id);
      }
    } else {
      // New vote
      const voteId = `vote_${uuidv4().substring(0, 8)}`;
      db.prepare('INSERT INTO adaptation_votes (id, user_id, adaptation_id, preferred) VALUES (?, ?, ?, ?)').run(voteId, userId, id, preferred);
      if (preferred === 'book') {
        db.prepare('UPDATE adaptations SET book_votes = book_votes + 1 WHERE id = ?').run(id);
      } else {
        db.prepare('UPDATE adaptations SET screen_votes = screen_votes + 1 WHERE id = ?').run(id);
      }
    }

    const updated = db.prepare('SELECT book_votes, screen_votes FROM adaptations WHERE id = ?').get(id);
    const totalVotes = updated.book_votes + updated.screen_votes;
    const bookPercentage = totalVotes > 0 ? Math.round((updated.book_votes / totalVotes) * 100) : 50;

    // Publish adaptation.voted event
    publishEvent('adaptation.voted', 'adaptation.voted', {
      userId,
      adaptationId: id,
      bookId: adaptation.book_id,
      preferred,
      title: adaptation.title
    });

    res.json({
      message: 'Vote recorded.',
      preferred,
      bookVotes: updated.book_votes,
      screenVotes: updated.screen_votes,
      bookPercentage,
      screenPercentage: 100 - bookPercentage
    });
  } catch (err) {
    console.error('[CATALOG SERVICE] voteAdaptation error:', err);
    res.status(500).json({ error: 'Internal error recording vote.' });
  }
};

exports.rateAdaptation = (req, res) => {
  try {
    const { id } = req.params;
    const { faithfulness, casting, story, overall } = req.body;
    const userId = req.user.id;

    const adaptation = db.prepare('SELECT * FROM adaptations WHERE id = ?').get(id);
    if (!adaptation) {
      return res.status(404).json({ error: 'Adaptation not found.' });
    }

    const existing = db.prepare('SELECT * FROM adaptation_ratings WHERE user_id = ? AND adaptation_id = ?').get(userId, id);

    if (existing) {
      db.prepare(`
        UPDATE adaptation_ratings
        SET faithfulness = ?, casting = ?, story = ?, overall = ?
        WHERE id = ?
      `).run(faithfulness, casting, story, overall, existing.id);
    } else {
      const ratingId = `adp_rate_${uuidv4().substring(0, 8)}`;
      db.prepare(`
        INSERT INTO adaptation_ratings (id, user_id, adaptation_id, faithfulness, casting, story, overall)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(ratingId, userId, id, faithfulness, casting, story, overall);
    }

    // Recalculate average scores
    const agg = db.prepare(`
      SELECT 
        AVG(faithfulness) as avg_faith,
        AVG(casting) as avg_cast,
        AVG(story) as avg_story,
        AVG(overall) as avg_overall,
        COUNT(*) as total_ratings
      FROM adaptation_ratings
      WHERE adaptation_id = ?
    `).get(id);

    db.prepare(`
      UPDATE adaptations
      SET faithfulness_score = ?, casting_score = ?, story_score = ?, overall_score = ?, ratings_count = ?
      WHERE id = ?
    `).run(
      parseFloat(agg.avg_faith.toFixed(1)),
      parseFloat(agg.avg_cast.toFixed(1)),
      parseFloat(agg.avg_story.toFixed(1)),
      parseFloat(agg.avg_overall.toFixed(1)),
      agg.total_ratings,
      id
    );

    res.json({
      message: 'Adaptation ratings saved.',
      scores: {
        faithfulness: parseFloat(agg.avg_faith.toFixed(1)),
        casting: parseFloat(agg.avg_cast.toFixed(1)),
        story: parseFloat(agg.avg_story.toFixed(1)),
        overall: parseFloat(agg.avg_overall.toFixed(1)),
        totalRatings: agg.total_ratings
      }
    });
  } catch (err) {
    console.error('[CATALOG SERVICE] rateAdaptation error:', err);
    res.status(500).json({ error: 'Internal error rating adaptation.' });
  }
};
