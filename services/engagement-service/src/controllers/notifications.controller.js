const db = require('../models/db');

exports.getNotifications = (req, res) => {
  try {
    const userId = req.user.id;
    const notifs = db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).all(userId);

    const formatted = notifs.map(n => ({
      ...n,
      isRead: Boolean(n.is_read)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('[ENGAGEMENT SERVICE] getNotifications error:', err);
    res.status(500).json({ error: 'Internal error fetching notifications.' });
  }
};

exports.markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, userId);

    res.json({ message: 'Notification marked as read.', id });
  } catch (err) {
    console.error('[ENGAGEMENT SERVICE] markAsRead error:', err);
    res.status(500).json({ error: 'Internal error marking notification read.' });
  }
};

exports.markAllRead = (req, res) => {
  try {
    const userId = req.user.id;
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(userId);
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('[ENGAGEMENT SERVICE] markAllRead error:', err);
    res.status(500).json({ error: 'Internal error marking all read.' });
  }
};
