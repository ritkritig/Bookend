const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');

function createNotification(userId, title, message, type, link) {
  const notifId = `notif_${Date.now()}_${uuidv4().substring(0, 6)}`;
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(notifId, userId, title, message, type, link || null);
  console.log(`[ENGAGEMENT NOTIFICATION] [${type}] to ${userId}: ${title}`);
}

function unlockAchievement(userId, achievementId) {
  const existing = db.prepare('SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?').get(userId, achievementId);
  if (existing) {
    return false; // Already unlocked (idempotent)
  }

  const achievement = db.prepare('SELECT * FROM achievements WHERE id = ?').get(achievementId);
  if (!achievement) return false;

  const id = `uach_${Date.now()}_${uuidv4().substring(0, 6)}`;
  db.prepare(`
    INSERT INTO user_achievements (id, user_id, achievement_id)
    VALUES (?, ?, ?)
  `).run(id, userId, achievementId);

  // Send celebratory notification
  createNotification(
    userId,
    `🏆 Achievement Unlocked: ${achievement.name}!`,
    achievement.description,
    'achievement',
    '/readquest'
  );

  console.log(`[ACHIEVEMENT UNLOCKED] ${userId} earned '${achievement.name}'!`);
  return true;
}

function evaluateAchievements(eventType, payload) {
  const userId = payload.userId;
  if (!userId) return;

  if (eventType === 'book.completed') {
    // Unlock First Finish
    unlockAchievement(userId, 'ach_first_finish');

    // Count completed books
    const completedChallenges = db.prepare(`
      SELECT current_count FROM user_challenge_progress 
      WHERE user_id = ? AND challenge_id = 'ch_genre_explorer'
    `).get(userId);

    const count = completedChallenges ? completedChallenges.current_count : 1;
    if (count >= 3) {
      unlockAchievement(userId, 'ach_bookworm');
    }
  } else if (eventType === 'story.published') {
    unlockAchievement(userId, 'ach_storylab_pioneer');
  } else if (eventType === 'book.rated') {
    unlockAchievement(userId, 'ach_critical_eye');
  } else if (eventType === 'adaptation.voted') {
    unlockAchievement(userId, 'ach_page_to_screen');
  }
}

module.exports = {
  unlockAchievement,
  createNotification,
  evaluateAchievements
};
