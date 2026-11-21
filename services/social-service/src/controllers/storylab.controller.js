const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { publishEvent } = require('../events/publisher');

const VALID_CATEGORIES = [
  'Sequel Idea',
  'Alternate Ending',
  'Fan Theory',
  'Character POV',
  'Adaptation Pitch',
  'Dream Casting',
  'General Story Discussion'
];

exports.createPost = (req, res) => {
  try {
    const {
      bookId,
      bookTitle,
      adaptationId,
      adaptationTitle,
      category,
      title,
      content,
      spoilerWarning
    } = req.body;
    const userId = req.user.id;
    const userName = req.user.username || 'Anonymous Reader';
    const userAvatar = req.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required.' });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }

    const postId = `story_${Date.now()}_${uuidv4().substring(0, 6)}`;
    const spoilerVal = spoilerWarning ? 1 : 0;

    db.prepare(`
      INSERT INTO storylab_posts (
        id, user_id, user_name, user_avatar, book_id, book_title,
        adaptation_id, adaptation_title, category, title, content,
        spoiler_warning, likes_count, comments_count, is_reported
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)
    `).run(
      postId,
      userId,
      userName,
      userAvatar,
      bookId || null,
      bookTitle || null,
      adaptationId || null,
      adaptationTitle || null,
      category,
      title,
      content,
      spoilerVal
    );

    // Publish event: story.published
    publishEvent('story.published', 'story.published', {
      userId,
      storyId: postId,
      bookId: bookId || null,
      bookTitle: bookTitle || null,
      category,
      title
    });

    const created = db.prepare('SELECT * FROM storylab_posts WHERE id = ?').get(postId);

    res.status(201).json({
      message: 'StoryLab theory published to the community.',
      post: created
    });
  } catch (err) {
    console.error('[SOCIAL SERVICE] createPost error:', err);
    res.status(500).json({ error: 'Internal error creating StoryLab post.' });
  }
};

exports.getPosts = (req, res) => {
  try {
    const { bookId, category, sort = 'trending', limit = 40, offset = 0 } = req.query;

    let query = 'SELECT * FROM storylab_posts WHERE is_reported = 0';
    const params = [];

    if (bookId) {
      query += ' AND book_id = ?';
      params.push(bookId);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (sort === 'new') {
      query += ' ORDER BY created_at DESC';
    } else if (sort === 'top') {
      query += ' ORDER BY likes_count DESC, comments_count DESC';
    } else {
      // Trending: recent with active engagement
      query += ' ORDER BY (likes_count * 2 + comments_count * 3) DESC, created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const posts = db.prepare(query).all(...params);

    const formatted = posts.map(p => {
      let isLiked = false;
      let isBookmarked = false;

      if (req.user) {
        const likeRow = db.prepare('SELECT id FROM storylab_likes WHERE user_id = ? AND post_id = ?').get(req.user.id, p.id);
        isLiked = Boolean(likeRow);

        const bookmarkRow = db.prepare('SELECT id FROM storylab_bookmarks WHERE user_id = ? AND post_id = ?').get(req.user.id, p.id);
        isBookmarked = Boolean(bookmarkRow);
      }

      return {
        ...p,
        spoilerWarning: Boolean(p.spoiler_warning),
        isLiked,
        isBookmarked
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('[SOCIAL SERVICE] getPosts error:', err);
    res.status(500).json({ error: 'Internal error fetching StoryLab posts.' });
  }
};

exports.getPostById = (req, res) => {
  try {
    const { id } = req.params;
    const post = db.prepare('SELECT * FROM storylab_posts WHERE id = ?').get(id);

    if (!post) {
      return res.status(404).json({ error: 'StoryLab post not found.' });
    }

    const comments = db.prepare('SELECT * FROM storylab_comments WHERE post_id = ? ORDER BY created_at ASC').all(id);

    let isLiked = false;
    let isBookmarked = false;

    if (req.user) {
      const likeRow = db.prepare('SELECT id FROM storylab_likes WHERE user_id = ? AND post_id = ?').get(req.user.id, id);
      isLiked = Boolean(likeRow);

      const bookmarkRow = db.prepare('SELECT id FROM storylab_bookmarks WHERE user_id = ? AND post_id = ?').get(req.user.id, id);
      isBookmarked = Boolean(bookmarkRow);
    }

    res.json({
      ...post,
      spoilerWarning: Boolean(post.spoiler_warning),
      isLiked,
      isBookmarked,
      comments
    });
  } catch (err) {
    console.error('[SOCIAL SERVICE] getPostById error:', err);
    res.status(500).json({ error: 'Internal error fetching post details.' });
  }
};

exports.updatePost = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, spoilerWarning } = req.body;
    const userId = req.user.id;

    const post = db.prepare('SELECT * FROM storylab_posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized. You can only edit your own creations.' });
    }

    const updatedTitle = title !== undefined ? title : post.title;
    const updatedContent = content !== undefined ? content : post.content;
    const updatedCategory = category !== undefined ? category : post.category;
    const updatedSpoiler = spoilerWarning !== undefined ? (spoilerWarning ? 1 : 0) : post.spoiler_warning;

    db.prepare(`
      UPDATE storylab_posts
      SET title = ?, content = ?, category = ?, spoiler_warning = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(updatedTitle, updatedContent, updatedCategory, updatedSpoiler, id);

    res.json({ message: 'StoryLab post updated successfully.' });
  } catch (err) {
    console.error('[SOCIAL SERVICE] updatePost error:', err);
    res.status(500).json({ error: 'Internal error updating post.' });
  }
};

exports.deletePost = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = db.prepare('SELECT * FROM storylab_posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized. You can only delete your own creations.' });
    }

    db.prepare('DELETE FROM storylab_posts WHERE id = ?').run(id);
    db.prepare('DELETE FROM storylab_likes WHERE post_id = ?').run(id);
    db.prepare('DELETE FROM storylab_comments WHERE post_id = ?').run(id);
    db.prepare('DELETE FROM storylab_bookmarks WHERE post_id = ?').run(id);

    res.json({ message: 'StoryLab post deleted.' });
  } catch (err) {
    console.error('[SOCIAL SERVICE] deletePost error:', err);
    res.status(500).json({ error: 'Internal error deleting post.' });
  }
};

exports.toggleLike = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = db.prepare('SELECT * FROM storylab_posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const existing = db.prepare('SELECT * FROM storylab_likes WHERE user_id = ? AND post_id = ?').get(userId, id);
    let liked = false;

    if (existing) {
      db.prepare('DELETE FROM storylab_likes WHERE id = ?').run(existing.id);
      db.prepare('UPDATE storylab_posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?').run(id);
      liked = false;
    } else {
      const likeId = `like_${uuidv4().substring(0, 8)}`;
      db.prepare('INSERT INTO storylab_likes (id, user_id, post_id) VALUES (?, ?, ?)').run(likeId, userId, id);
      db.prepare('UPDATE storylab_posts SET likes_count = likes_count + 1 WHERE id = ?').run(id);
      liked = true;

      // Publish event: story.liked
      publishEvent('story.liked', 'story.liked', {
        userId,
        storyId: id,
        authorId: post.user_id,
        title: post.title
      });
    }

    const updated = db.prepare('SELECT likes_count FROM storylab_posts WHERE id = ?').get(id);

    res.json({
      message: liked ? 'Liked.' : 'Unliked.',
      liked,
      likesCount: updated.likes_count
    });
  } catch (err) {
    console.error('[SOCIAL SERVICE] toggleLike error:', err);
    res.status(500).json({ error: 'Internal error toggling like.' });
  }
};

exports.toggleBookmark = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = db.prepare('SELECT * FROM storylab_bookmarks WHERE user_id = ? AND post_id = ?').get(userId, id);
    let bookmarked = false;

    if (existing) {
      db.prepare('DELETE FROM storylab_bookmarks WHERE id = ?').run(existing.id);
      bookmarked = false;
    } else {
      const bId = `bm_${uuidv4().substring(0, 8)}`;
      db.prepare('INSERT INTO storylab_bookmarks (id, user_id, post_id) VALUES (?, ?, ?)').run(bId, userId, id);
      bookmarked = true;
    }

    res.json({ message: bookmarked ? 'Saved to bookmarks.' : 'Removed from bookmarks.', bookmarked });
  } catch (err) {
    console.error('[SOCIAL SERVICE] toggleBookmark error:', err);
    res.status(500).json({ error: 'Internal error toggling bookmark.' });
  }
};

exports.addComment = (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const userName = req.user.username || 'Reader';
    const userAvatar = req.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty.' });
    }

    const post = db.prepare('SELECT * FROM storylab_posts WHERE id = ?').get(id);
    if (!post) {
      return res.status(404).json({ error: 'StoryLab post not found.' });
    }

    const commentId = `cmt_${Date.now()}_${uuidv4().substring(0, 6)}`;

    db.prepare(`
      INSERT INTO storylab_comments (id, post_id, user_id, user_name, user_avatar, content)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(commentId, id, userId, userName, userAvatar, content.trim());

    db.prepare('UPDATE storylab_posts SET comments_count = comments_count + 1 WHERE id = ?').run(id);

    const comment = db.prepare('SELECT * FROM storylab_comments WHERE id = ?').get(commentId);

    res.status(201).json({
      message: 'Comment added.',
      comment
    });
  } catch (err) {
    console.error('[SOCIAL SERVICE] addComment error:', err);
    res.status(500).json({ error: 'Internal error adding comment.' });
  }
};

exports.getComments = (req, res) => {
  try {
    const { id } = req.params;
    const comments = db.prepare('SELECT * FROM storylab_comments WHERE post_id = ? ORDER BY created_at ASC').all(id);
    res.json(comments);
  } catch (err) {
    console.error('[SOCIAL SERVICE] getComments error:', err);
    res.status(500).json({ error: 'Internal error getting comments.' });
  }
};

exports.reportPost = (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const reportId = `rep_${uuidv4().substring(0, 8)}`;
    db.prepare(`
      INSERT INTO storylab_reports (id, post_id, user_id, reason)
      VALUES (?, ?, ?, ?)
    `).run(reportId, id, userId, reason || 'Inappropriate fan content or copyright violation');

    res.json({ message: 'Report submitted for editorial moderation review.' });
  } catch (err) {
    console.error('[SOCIAL SERVICE] reportPost error:', err);
    res.status(500).json({ error: 'Internal error submitting report.' });
  }
};
