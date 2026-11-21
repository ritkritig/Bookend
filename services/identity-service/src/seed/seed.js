const bcrypt = require('bcryptjs');
const db = require('../models/db');

function seedUsers() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (countRow.count > 0) {
    console.log(`[IDENTITY SERVICE] Database already contains ${countRow.count} users. Skipping seed.`);
    return;
  }

  console.log('[IDENTITY SERVICE] Seeding demo readers...');
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('password123', salt);

  const demoUsers = [
    {
      id: 'user_elena_vance',
      username: 'elena',
      email: 'elena@bookend.io',
      display_name: 'Elena Vance',
      bio: 'Obsessed with high-concept sci-fi worldbuilding and Denis Villeneuve cinema adaptations. Frank Herbert loyalist.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      favorite_genres: JSON.stringify(['Science Fiction', 'Space Opera', 'Dystopian', 'Classics']),
      reading_goal_yearly: 30
    },
    {
      id: 'user_marcus_thorne',
      username: 'marcus',
      email: 'marcus@bookend.io',
      display_name: 'Marcus Thorne',
      bio: 'Psychological thriller and dark mystery collector. Gillian Flynn & David Fincher enthusiast.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      favorite_genres: JSON.stringify(['Thriller', 'Psychological Fiction', 'Mystery', 'Crime']),
      reading_goal_yearly: 24
    },
    {
      id: 'user_aria_chen',
      username: 'aria',
      email: 'aria@bookend.io',
      display_name: 'Aria Chen',
      bio: 'Fantasy epic reader and StoryLab screenwriter in the making. Tolkien, Gaiman, and magical realism.',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      favorite_genres: JSON.stringify(['Fantasy', 'Magical Realism', 'Historical Fiction', 'Romance']),
      reading_goal_yearly: 40
    },
    {
      id: 'user_rohan_sharma',
      username: 'rohan',
      email: 'rohan@bookend.io',
      display_name: 'Rohan Sharma',
      bio: 'Contemporary literature lover and Indian post-colonial fiction explorer. Arundhati Roy & Salman Rushdie.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      favorite_genres: JSON.stringify(['Literary Fiction', 'Indian Literature', 'Contemporary', 'Classics']),
      reading_goal_yearly: 20
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar_url, favorite_genres, reading_goal_yearly)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const u of demoUsers) {
    stmt.run(u.id, u.username, u.email, passwordHash, u.display_name, u.bio, u.avatar_url, u.favorite_genres, u.reading_goal_yearly);
  }

  console.log(`[IDENTITY SERVICE] Successfully seeded ${demoUsers.length} readers.`);
}

module.exports = { seedUsers };
