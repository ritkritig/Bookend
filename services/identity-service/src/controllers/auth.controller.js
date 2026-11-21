const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const config = require('../config');

exports.register = (req, res) => {
  try {
    const { username, email, password, displayName, favoriteGenres, bio, avatarUrl } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existing) {
      return res.status(409).json({ error: 'A reader with that username or email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = `user_${uuidv4().substring(0, 8)}`;
    const finalDisplayName = displayName || username;
    const genresJson = JSON.stringify(favoriteGenres || ['Fiction', 'Literary']);
    const finalAvatar = avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`;

    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar_url, favorite_genres, reading_goal_yearly)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      username.toLowerCase().trim(),
      email.toLowerCase().trim(),
      passwordHash,
      finalDisplayName,
      bio || 'Avid reader and cinema lover exploring stories across mediums.',
      finalAvatar,
      genresJson,
      25
    );

    const token = jwt.sign(
      { id: userId, username: username.toLowerCase().trim(), email: email.toLowerCase().trim() },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(201).json({
      message: 'Welcome to Bookend.',
      token,
      user: {
        id: userId,
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        displayName: finalDisplayName,
        bio: bio || 'Avid reader and cinema lover exploring stories across mediums.',
        avatarUrl: finalAvatar,
        favoriteGenres: JSON.parse(genresJson),
        readingGoalYearly: 25
      }
    });
  } catch (err) {
    console.error('[IDENTITY SERVICE] Registration error:', err);
    res.status(500).json({ error: 'Internal error processing registration.' });
  }
};

exports.login = (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: 'Username/email and password are required.' });
    }

    const user = db.prepare(`
      SELECT * FROM users WHERE username = ? OR email = ?
    `).get(login.toLowerCase().trim(), login.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ error: 'Invalid reader credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid reader credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({
      message: 'Successfully authenticated.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        favoriteGenres: user.favorite_genres ? JSON.parse(user.favorite_genres) : [],
        readingGoalYearly: user.reading_goal_yearly,
        createdAt: user.created_at
      }
    });
  } catch (err) {
    console.error('[IDENTITY SERVICE] Login error:', err);
    res.status(500).json({ error: 'Internal error processing login.' });
  }
};

exports.getMe = (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, username, email, display_name, bio, avatar_url, favorite_genres, reading_goal_yearly, created_at
      FROM users WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Reader profile not found.' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.display_name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      favoriteGenres: user.favorite_genres ? JSON.parse(user.favorite_genres) : [],
      readingGoalYearly: user.reading_goal_yearly,
      createdAt: user.created_at
    });
  } catch (err) {
    console.error('[IDENTITY SERVICE] getMe error:', err);
    res.status(500).json({ error: 'Internal error fetching reader profile.' });
  }
};
