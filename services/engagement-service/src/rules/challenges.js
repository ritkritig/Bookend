const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { createNotification } = require('./achievements');

function incrementChallenge(userId, challengeId, incrementBy = 1) {
  const challenge = db.prepare('SELECT * FROM challenges WHERE id = ?').get(challengeId);
  if (!challenge) return;

  const existing = db.prepare('SELECT * FROM user_challenge_progress WHERE user_id = ? AND challenge_id = ?').get(userId, challengeId);

  const now = new Date().toISOString();

  if (existing) {
    if (existing.is_completed) return; // Already finished

    const newCount = Math.min(challenge.target_count, existing.current_count + incrementBy);
    const completed = newCount >= challenge.target_count ? 1 : 0;

    db.prepare(`
      UPDATE user_challenge_progress
      SET current_count = ?, is_completed = ?, completed_at = CASE WHEN ? = 1 THEN ? ELSE completed_at END, updated_at = ?
      WHERE id = ?
    `).run(newCount, completed, completed, now, now, existing.id);

    if (completed && !existing.is_completed) {
      createNotification(
        userId,
        `🎉 Challenge Completed: ${challenge.title}!`,
        `You completed all requirements for "${challenge.title}". Badge reward unlocked!`,
        'challenge',
        '/readquest'
      );
    }
  } else {
    const id = `prog_${Date.now()}_${uuidv4().substring(0, 6)}`;
    const initialCount = Math.min(challenge.target_count, incrementBy);
    const completed = initialCount >= challenge.target_count ? 1 : 0;

    db.prepare(`
      INSERT INTO user_challenge_progress (id, user_id, challenge_id, current_count, target_count, is_completed, completed_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, challengeId, initialCount, challenge.target_count, completed, completed ? now : null, now);
  }
}

function updateStreak(userId) {
  const today = new Date().toISOString().split('T')[0];
  const existing = db.prepare('SELECT * FROM user_reading_streaks WHERE user_id = ?').get(userId);

  if (existing) {
    if (existing.last_activity_date === today) {
      return; // Already counted today
    }

    const lastDate = new Date(existing.last_activity_date);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));

    let newStreak = existing.current_streak;
    if (diffDays === 1) {
      newStreak += 1; // Consecutive day
    } else if (diffDays > 1) {
      newStreak = 1; // Reset streak
    }

    const longest = Math.max(existing.longest_streak, newStreak);

    db.prepare(`
      UPDATE user_reading_streaks
      SET current_streak = ?, longest_streak = ?, last_activity_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(newStreak, longest, today, userId);
  } else {
    db.prepare(`
      INSERT INTO user_reading_streaks (user_id, current_streak, longest_streak, last_activity_date)
      VALUES (?, 1, 1, ?)
    `).run(userId, today);
  }
}

function evaluateChallenges(eventType, payload) {
  const userId = payload.userId;
  if (!userId) return;

  updateStreak(userId);

  if (eventType === 'book.completed') {
    const genres = payload.genres || [];
    const title = (payload.title || '').toLowerCase();
    const author = (payload.author || '').toLowerCase();

    // Universal progress: Genre Explorer
    incrementChallenge(userId, 'ch_genre_explorer', 1);

    // Page to Screen Challenge
    if (['dune', 'gone girl', 'the book thief', 'station eleven', 'sharp objects', 'the fellowship of the ring', 'good omens', 'pride and prejudice'].some(t => title.includes(t))) {
      incrementChallenge(userId, 'ch_page_to_screen', 1);
    }

    // Classics Challenge
    if (genres.includes('Classics') || ['austen', 'tolkien', 'herbert'].some(a => author.includes(a))) {
      incrementChallenge(userId, 'ch_classics', 1);
    }

    // Indian Authors Challenge
    if (genres.includes('Indian Literature') || author.includes('roy') || author.includes('sharma') || author.includes('rushdie')) {
      incrementChallenge(userId, 'ch_indian_authors', 1);
    }

    // Mystery Month
    if (genres.includes('Thriller') || genres.includes('Mystery') || genres.includes('Crime')) {
      incrementChallenge(userId, 'ch_mystery_month', 1);
    }
  } else if (eventType === 'adaptation.voted') {
    incrementChallenge(userId, 'ch_page_to_screen', 1);
  } else if (eventType === 'story.published') {
    // Notify followers or community
    createNotification(
      userId,
      `✍️ StoryLab Published: "${payload.title}"`,
      `Your creative pitch is live for reader discussion.`,
      'social',
      `/storylab`
    );
  } else if (eventType === 'story.liked') {
    if (payload.authorId && payload.authorId !== payload.userId) {
      createNotification(
        payload.authorId,
        `❤️ Reader Liked Your Theory!`,
        `A reader appreciated your StoryLab post "${payload.title}".`,
        'social',
        '/storylab'
      );
    }
  }
}

module.exports = {
  incrementChallenge,
  evaluateChallenges,
  updateStreak
};
