const db = require('../models/db');

function seedEngagement() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM challenges').get();
  if (countRow.count > 0) {
    console.log(`[ENGAGEMENT SERVICE] Database already contains ${countRow.count} challenges. Skipping seed.`);
    return;
  }

  console.log('[ENGAGEMENT SERVICE] Seeding ReadQuest challenges, achievements, and streaks...');

  const challenges = [
    {
      id: 'ch_page_to_screen',
      title: 'Page to Screen',
      description: 'Read novels and engage with their cinematic screen adaptations.',
      icon: 'Film',
      target_count: 3,
      category: 'Adaptations',
      badge_reward: 'Silver Reel Badge'
    },
    {
      id: 'ch_genre_explorer',
      title: 'Genre Explorer',
      description: 'Expand your horizons by completing books across diverse speculative and literary genres.',
      icon: 'Compass',
      target_count: 5,
      category: 'Exploration',
      badge_reward: 'Golden Compass Badge'
    },
    {
      id: 'ch_classics',
      title: 'Classics Challenge',
      description: 'Immerse yourself in foundational pillars of world literature.',
      icon: 'BookOpen',
      target_count: 3,
      category: 'Literary',
      badge_reward: 'Gilded Laurel Badge'
    },
    {
      id: 'ch_indian_authors',
      title: 'Indian Authors Challenge',
      description: 'Discover the rich prose of contemporary and classic Indian storytellers.',
      icon: 'Feather',
      target_count: 3,
      category: 'Regional',
      badge_reward: 'Lotus Quota Badge'
    },
    {
      id: 'ch_around_the_world',
      title: 'Around the World',
      description: 'Read works written by international authors across 4 different continents.',
      icon: 'Globe',
      target_count: 4,
      category: 'Global',
      badge_reward: 'Voyager Medal'
    },
    {
      id: 'ch_mystery_month',
      title: 'Mystery & Thriller Month',
      description: 'Devour spine-tingling psychological thrillers and crime puzzles.',
      icon: 'Eye',
      target_count: 3,
      category: 'Thematic',
      badge_reward: 'Noir Detective Crest'
    }
  ];

  const chStmt = db.prepare(`
    INSERT INTO challenges (id, title, description, icon, target_count, category, badge_reward)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of challenges) {
    chStmt.run(c.id, c.title, c.description, c.icon, c.target_count, c.category, c.badge_reward);
  }

  const achievements = [
    {
      id: 'ach_first_finish',
      name: 'First Finish',
      description: 'Completed your first book and marked it in your personal Bookend library.',
      icon: 'BookMarked',
      criteria_type: 'books_completed',
      criteria_value: 1
    },
    {
      id: 'ach_bookworm',
      name: 'Bookworm',
      description: 'Completed 3 books in your library collection.',
      icon: 'Library',
      criteria_type: 'books_completed',
      criteria_value: 3
    },
    {
      id: 'ach_on_fire',
      name: 'On Fire',
      description: 'Maintained an active reading streak for 7 consecutive days.',
      icon: 'Flame',
      criteria_type: 'streak_days',
      criteria_value: 7
    },
    {
      id: 'ach_page_to_screen',
      name: 'Page to Screen Master',
      description: 'Compared a book with its screen adaptation and cast your community vote.',
      icon: 'Clapperboard',
      criteria_type: 'adaptation_votes',
      criteria_value: 1
    },
    {
      id: 'ach_storylab_pioneer',
      name: 'StoryLab Pioneer',
      description: 'Published your first creative theory, alternate ending, or adaptation pitch.',
      icon: 'Sparkles',
      criteria_type: 'stories_published',
      criteria_value: 1
    },
    {
      id: 'ach_critical_eye',
      name: 'Critical Eye',
      description: 'Contributed ratings and reviews to help shape community discovery.',
      icon: 'Star',
      criteria_type: 'ratings_count',
      criteria_value: 3
    }
  ];

  const achStmt = db.prepare(`
    INSERT INTO achievements (id, name, description, icon, criteria_type, criteria_value)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const a of achievements) {
    achStmt.run(a.id, a.name, a.description, a.icon, a.criteria_type, a.criteria_value);
  }

  // Seed initial user achievements and streaks for demo users
  const demoUsers = [
    {
      userId: 'user_elena_vance',
      streak: 12,
      achievements: ['ach_first_finish', 'ach_bookworm', 'ach_on_fire', 'ach_page_to_screen', 'ach_storylab_pioneer', 'ach_critical_eye'],
      challenges: [
        { challenge_id: 'ch_page_to_screen', current: 2, completed: 0 },
        { challenge_id: 'ch_genre_explorer', current: 3, completed: 0 },
        { challenge_id: 'ch_classics', current: 2, completed: 0 }
      ]
    },
    {
      userId: 'user_marcus_thorne',
      streak: 5,
      achievements: ['ach_first_finish', 'ach_bookworm', 'ach_critical_eye', 'ach_page_to_screen'],
      challenges: [
        { challenge_id: 'ch_mystery_month', current: 2, completed: 0 },
        { challenge_id: 'ch_page_to_screen', current: 2, completed: 0 }
      ]
    },
    {
      userId: 'user_aria_chen',
      streak: 8,
      achievements: ['ach_first_finish', 'ach_bookworm', 'ach_on_fire', 'ach_storylab_pioneer'],
      challenges: [
        { challenge_id: 'ch_genre_explorer', current: 5, completed: 1 },
        { challenge_id: 'ch_classics', current: 2, completed: 0 }
      ]
    }
  ];

  const uachStmt = db.prepare(`
    INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const streakStmt = db.prepare(`
    INSERT INTO user_reading_streaks (user_id, current_streak, longest_streak, last_activity_date)
    VALUES (?, ?, ?, ?)
  `);

  const ucpStmt = db.prepare(`
    INSERT INTO user_challenge_progress (id, user_id, challenge_id, current_count, target_count, is_completed, completed_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const nowIso = new Date().toISOString();
  const today = nowIso.split('T')[0];

  for (const du of demoUsers) {
    streakStmt.run(du.userId, du.streak, du.streak + 4, today);

    for (const ach of du.achievements) {
      uachStmt.run(`uach_${du.userId}_${ach}`, du.userId, ach);
    }

    for (const c of du.challenges) {
      const ch = challenges.find(item => item.id === c.challenge_id);
      if (ch) {
        ucpStmt.run(
          `ucp_${du.userId}_${c.challenge_id}`,
          du.userId,
          c.challenge_id,
          c.current,
          ch.target_count,
          c.completed,
          c.completed ? nowIso : null
        );
      }
    }
  }

  // Seed sample initial notification for Elena
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'notif_welcome_elena',
    'user_elena_vance',
    '✨ Welcome to Bookend!',
    'Your personalized reading library and NextRead discovery engine are active.',
    'system',
    '/discover'
  );

  console.log(`[ENGAGEMENT SERVICE] Successfully seeded ${challenges.length} challenges, ${achievements.length} achievements.`);
}

module.exports = { seedEngagement };
