const db = require('../models/db');

function seedSocial() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM storylab_posts').get();
  if (countRow.count > 0) {
    console.log(`[SOCIAL SERVICE] Database already contains ${countRow.count} StoryLab posts. Skipping seed.`);
    return;
  }

  console.log('[SOCIAL SERVICE] Seeding creative StoryLab community theories and pitches...');

  const posts = [
    {
      id: 'story_dune_villeneuve',
      user_id: 'user_elena_vance',
      user_name: 'Elena Vance',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      book_id: 'book_dune',
      book_title: 'Dune',
      adaptation_id: 'adp_dune_part_two',
      adaptation_title: 'Dune: Part Two (2024)',
      category: 'Fan Theory',
      title: 'Denis Villeneuve perfected Frank Herbert’s cautionary thesis far better than Lynch or the miniseries',
      content: `Herbert famously stated that his purpose in writing Dune was to warn people about charismatic leaders. But the original 1965 book was so intoxicating in its hero journey that many readers treated Paul as an uncritical savior.\n\nVilleneuve\'s radical cinematic stroke in Part Two is filtering the final act entirely through Chani’s horrified eyes. When Paul takes the throne and threatens to starve the Great Houses by burning the spice fields, Zendaya\'s performance grounds the tragedy. It is not a triumph—it is the birth of an unstoppable holy war. This is transformative adaptation at its absolute zenith.`,
      spoiler_warning: 1,
      likes_count: 42,
      comments_count: 8
    },
    {
      id: 'story_rudy_survives',
      user_id: 'user_aria_chen',
      user_name: 'Aria Chen',
      user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      book_id: 'book_the_book_thief',
      book_title: 'The Book Thief',
      adaptation_id: 'adp_the_book_thief_2013',
      adaptation_title: 'The Book Thief (2013)',
      category: 'Alternate Ending',
      title: 'What if Rudy Steiner had gone to the river twenty minutes earlier?',
      content: `Death tells us throughout The Book Thief that Rudy is marked. His hair is like lemons; he ran the Jesse Owens relay; his heart was simply too loud for Himmel Street.\n\nImagine an alternate trajectory where Rudy, instead of sleeping during the unexpected raid, had walked down to the Amper River to hide Liesel’s newly stolen lexicon. He survives the bombing. He is the one who finds her among the rubble, holding the charred notebook. Would they have ever kissed as adults, or would the shared trauma of losing Hans and Rosa have cemented an unspoken sibling grief? Zusak gave us heartbreak because grief preserved their purity, but in my head, Rudy grows old running a tiny print shop in Stuttgart.`,
      spoiler_warning: 1,
      likes_count: 38,
      comments_count: 5
    },
    {
      id: 'story_gone_girl_sequel',
      user_id: 'user_marcus_thorne',
      user_name: 'Marcus Thorne',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      book_id: 'book_gone_girl',
      book_title: 'Gone Girl',
      adaptation_id: 'adp_gone_girl_2014',
      adaptation_title: 'Gone Girl (2014)',
      category: 'Sequel Idea',
      title: 'Gone Girl 2: The Teenage Heir to the "Amazing Amy" Fortune',
      content: `Ten years after the horrific domestic armistice at the end of Gone Girl, Nick and Amy’s child is sixteen. Imagine a child raised by two sociopathically tactical parents who spent sixteen years smiling on morning television while surveilling each other with audio recorders.\n\nThe child discovers Nick’s secret encrypted journals and Amy’s old psychological notebooks. Instead of rebelling through typical teenage angst, the child plays both of them against each other in an inheritance war. Gillian Flynn has teased returning to Nick and Amy when they are older—this is the only sequel format that wouldn\'t diminish Fincher\'s immaculate ending.`,
      spoiler_warning: 1,
      likes_count: 29,
      comments_count: 4
    },
    {
      id: 'story_midnight_library_pitch',
      user_id: 'user_rohan_sharma',
      user_name: 'Rohan Sharma',
      user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      book_id: 'book_midnight_library',
      book_title: 'The Midnight Library',
      adaptation_id: null,
      adaptation_title: null,
      category: 'Adaptation Pitch',
      title: 'A 6-Part Anthology Mini-Series for The Midnight Library (A24 / Netflix)',
      content: `Matt Haig\'s novel shouldn\'t be crammed into a standard two-hour feature film. Each major life Nora Seed samples deserves its own full 55-minute cinematic exploration.\n\nEpisode 1: The Glaciologist in Svalbard (Stark arctic horror meets solitary introspection)\nEpisode 2: The Rock Star at Hammersmith Apollo\nEpisode 3: The Country Vineyard with Dan\nEpisode 4: The Olympic Swimmer\nEpisode 5: The Cambridge Philosopher\nEpisode 6: The Return to Bedford\n\nDream Casting: Florence Pugh as Nora Seed, Olivia Colman as Mrs. Elm. Score by Max Richter.`,
      spoiler_warning: 0,
      likes_count: 53,
      comments_count: 12
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO storylab_posts (
      id, user_id, user_name, user_avatar, book_id, book_title,
      adaptation_id, adaptation_title, category, title, content,
      spoiler_warning, likes_count, comments_count, is_reported
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `);

  for (const p of posts) {
    stmt.run(
      p.id, p.user_id, p.user_name, p.user_avatar, p.book_id, p.book_title,
      p.adaptation_id, p.adaptation_title, p.category, p.title, p.content,
      p.spoiler_warning, p.likes_count, p.comments_count
    );
  }

  // Seed initial comments
  const comments = [
    {
      id: 'cmt_1',
      post_id: 'story_dune_villeneuve',
      user_id: 'user_aria_chen',
      user_name: 'Aria Chen',
      user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      content: '100% agreed! In the 1965 text, Chani is almost entirely passive in the final chapters. Villeneuve making her the moral conscience elevated the cinematic experience tremendously.'
    },
    {
      id: 'cmt_2',
      post_id: 'story_rudy_survives',
      user_id: 'user_elena_vance',
      user_name: 'Elena Vance',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      content: 'Reading this gave me goosebumps all over again. "The Jesse Owens incident" still lives rent-free in my soul.'
    },
    {
      id: 'cmt_3',
      post_id: 'story_midnight_library_pitch',
      user_id: 'user_marcus_thorne',
      user_name: 'Marcus Thorne',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      content: 'Olivia Colman as Mrs. Elm is the most inspired casting suggestion I have seen on Bookend yet. Somebody pitch this to BBC immediately.'
    }
  ];

  const cmtStmt = db.prepare(`
    INSERT INTO storylab_comments (id, post_id, user_id, user_name, user_avatar, content)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const c of comments) {
    cmtStmt.run(c.id, c.post_id, c.user_id, c.user_name, c.user_avatar, c.content);
  }

  console.log(`[SOCIAL SERVICE] Successfully seeded ${posts.length} StoryLab posts and community comments.`);
}

module.exports = { seedSocial };
