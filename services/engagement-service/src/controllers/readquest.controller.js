const db = require('../models/db');
const { handleDomainEvent } = require('../events/consumer');

exports.getDashboard = (req, res) => {
  try {
    const userId = req.user.id;

    // Streaks
    const streakRow = db.prepare('SELECT current_streak, longest_streak FROM user_reading_streaks WHERE user_id = ?').get(userId);
    const streak = streakRow || { current_streak: 1, longest_streak: 1 };

    // Challenges with progress
    const challenges = db.prepare(`
      SELECT 
        c.*,
        COALESCE(ucp.current_count, 0) as current_count,
        COALESCE(ucp.is_completed, 0) as is_completed,
        ucp.completed_at
      FROM challenges c
      LEFT JOIN user_challenge_progress ucp ON (c.id = ucp.challenge_id AND ucp.user_id = ?)
    `).all(userId);

    const formattedChallenges = challenges.map(c => ({
      ...c,
      isCompleted: Boolean(c.is_completed),
      progressPercentage: Math.min(100, Math.round((c.current_count / c.target_count) * 100))
    }));

    // Achievements with unlock status
    const achievements = db.prepare(`
      SELECT 
        a.*,
        ua.unlocked_at,
        CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as is_unlocked
      FROM achievements a
      LEFT JOIN user_achievements ua ON (a.id = ua.achievement_id AND ua.user_id = ?)
      ORDER BY a.criteria_value ASC
    `).all(userId);

    const formattedAchievements = achievements.map(a => ({
      ...a,
      isUnlocked: Boolean(a.is_unlocked)
    }));

    res.json({
      userId,
      streak: {
        current: streak.current_streak,
        longest: streak.longest_streak
      },
      challenges: formattedChallenges,
      achievements: formattedAchievements
    });
  } catch (err) {
    console.error('[ENGAGEMENT SERVICE] getDashboard error:', err);
    res.status(500).json({ error: 'Internal error loading ReadQuest dashboard.' });
  }
};

exports.getChallenges = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    let challenges;
    if (userId) {
      challenges = db.prepare(`
        SELECT 
          c.*,
          COALESCE(ucp.current_count, 0) as current_count,
          COALESCE(ucp.is_completed, 0) as is_completed,
          ucp.completed_at
        FROM challenges c
        LEFT JOIN user_challenge_progress ucp ON (c.id = ucp.challenge_id AND ucp.user_id = ?)
      `).all(userId);
    } else {
      challenges = db.prepare('SELECT *, 0 as current_count, 0 as is_completed FROM challenges').all();
    }

    const formatted = challenges.map(c => ({
      ...c,
      isCompleted: Boolean(c.is_completed),
      progressPercentage: Math.min(100, Math.round((c.current_count / c.target_count) * 100))
    }));

    res.json(formatted);
  } catch (err) {
    console.error('[ENGAGEMENT SERVICE] getChallenges error:', err);
    res.status(500).json({ error: 'Internal error fetching challenges.' });
  }
};

exports.getAchievements = (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    let achievements;
    if (userId) {
      achievements = db.prepare(`
        SELECT 
          a.*,
          ua.unlocked_at,
          CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as is_unlocked
        FROM achievements a
        LEFT JOIN user_achievements ua ON (a.id = ua.achievement_id AND ua.user_id = ?)
      `).all(userId);
    } else {
      achievements = db.prepare('SELECT *, 0 as is_unlocked, null as unlocked_at FROM achievements').all();
    }

    res.json(achievements.map(a => ({ ...a, isUnlocked: Boolean(a.is_unlocked) })));
  } catch (err) {
    console.error('[ENGAGEMENT SERVICE] getAchievements error:', err);
    res.status(500).json({ error: 'Internal error fetching achievements.' });
  }
};

exports.receiveEventWebhook = (req, res) => {
  try {
    const event = req.body;
    const handled = handleDomainEvent(event);
    res.json({ received: true, processed: handled });
  } catch (err) {
    console.error('[ENGAGEMENT SERVICE] receiveEventWebhook error:', err);
    res.status(500).json({ error: 'Error processing event webhook.' });
  }
};
