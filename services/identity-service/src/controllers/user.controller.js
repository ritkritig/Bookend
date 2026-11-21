const db = require('../models/db');

exports.updateProfile = (req, res) => {
  try {
    const { displayName, bio, avatarUrl, favoriteGenres, readingGoalYearly } = req.body;
    const userId = req.user.id;

    const current = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!current) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const newDisplayName = displayName !== undefined ? displayName : current.display_name;
    const newBio = bio !== undefined ? bio : current.bio;
    const newAvatar = avatarUrl !== undefined ? avatarUrl : current.avatar_url;
    const newGenres = favoriteGenres !== undefined ? JSON.stringify(favoriteGenres) : current.favorite_genres;
    const newGoal = readingGoalYearly !== undefined ? parseInt(readingGoalYearly, 10) : current.reading_goal_yearly;

    db.prepare(`
      UPDATE users
      SET display_name = ?, bio = ?, avatar_url = ?, favorite_genres = ?, reading_goal_yearly = ?
      WHERE id = ?
    `).run(newDisplayName, newBio, newAvatar, newGenres, newGoal, userId);

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: userId,
        username: current.username,
        email: current.email,
        displayName: newDisplayName,
        bio: newBio,
        avatarUrl: newAvatar,
        favoriteGenres: JSON.parse(newGenres),
        readingGoalYearly: newGoal
      }
    });
  } catch (err) {
    console.error('[IDENTITY SERVICE] updateProfile error:', err);
    res.status(500).json({ error: 'Internal error updating profile.' });
  }
};

exports.getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare(`
      SELECT id, username, display_name, bio, avatar_url, favorite_genres, reading_goal_yearly, created_at
      FROM users WHERE id = ?
    `).get(id);

    if (!user) {
      return res.status(404).json({ error: 'Reader not found.' });
    }

    res.json({
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      favoriteGenres: user.favorite_genres ? JSON.parse(user.favorite_genres) : [],
      readingGoalYearly: user.reading_goal_yearly,
      createdAt: user.created_at
    });
  } catch (err) {
    console.error('[IDENTITY SERVICE] getUserById error:', err);
    res.status(500).json({ error: 'Internal error fetching reader.' });
  }
};

exports.getAllUsers = (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, username, display_name, bio, avatar_url, favorite_genres, reading_goal_yearly
      FROM users
      ORDER BY id ASC
    `).all();

    const formatted = users.map(u => ({
      id: u.id,
      username: u.username,
      displayName: u.display_name,
      bio: u.bio,
      avatarUrl: u.avatar_url,
      favoriteGenres: u.favorite_genres ? JSON.parse(u.favorite_genres) : [],
      readingGoalYearly: u.reading_goal_yearly
    }));

    res.json(formatted);
  } catch (err) {
    console.error('[IDENTITY SERVICE] getAllUsers error:', err);
    res.status(500).json({ error: 'Internal error listing readers.' });
  }
};
