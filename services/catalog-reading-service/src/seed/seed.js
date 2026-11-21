const db = require('../models/db');

function seedCatalog() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM books').get();
  if (countRow.count > 0) {
    console.log(`[CATALOG SERVICE] Database already contains ${countRow.count} books. Skipping seed.`);
    return;
  }

  console.log('[CATALOG SERVICE] Seeding rich books and adaptations catalog...');

  const books = [
    {
      id: 'book_dune',
      title: 'Dune',
      author: 'Frank Herbert',
      description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness. A triumph of imagination and one of the bestselling science fiction novels of all time.',
      cover_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80',
      published_year: 1965,
      page_count: 688,
      genres: JSON.stringify(['Science Fiction', 'Space Opera', 'Classics', 'Adventure']),
      average_rating: 4.8,
      ratings_count: 240,
      editorial_quote: 'A monumental epic that redefined science fiction worldbuilding forever.'
    },
    {
      id: 'book_gone_girl',
      title: 'Gone Girl',
      author: 'Gillian Flynn',
      description: 'On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne’s fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick’s clever and beautiful wife disappears from their rented Tudor home. A masterclass in unreliable narration and razor-sharp psychological suspense.',
      cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      published_year: 2012,
      page_count: 432,
      genres: JSON.stringify(['Thriller', 'Psychological Fiction', 'Mystery', 'Crime']),
      average_rating: 4.6,
      ratings_count: 190,
      editorial_quote: 'The defining psychological thriller of the 21st century.'
    },
    {
      id: 'book_the_book_thief',
      title: 'The Book Thief',
      author: 'Markus Zusak',
      description: 'Narrated by Death, this hauntingly beautiful story follows Liesel Meminger, a foster girl living outside of Munich in Nazi Germany during World War II, who scratches out a meager existence for herself by stealing books and sharing them with her neighbors and the Jewish man hidden in her basement.',
      cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      published_year: 2005,
      page_count: 552,
      genres: JSON.stringify(['Historical Fiction', 'Literary Fiction', 'Classics']),
      average_rating: 4.9,
      ratings_count: 310,
      editorial_quote: 'An unforgettable testament to the enduring power of words and empathy.'
    },
    {
      id: 'book_fellowship',
      title: 'The Fellowship of the Ring',
      author: 'J.R.R. Tolkien',
      description: 'The first volume in The Lord of the Rings trilogy tells of Frodo Baggins, a hobbit who inherits a ring that holds the key to the dominion or destruction of all Middle-earth, and his perilous journey with a fellowship of companions to cast it into the fires of Mount Doom.',
      cover_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80',
      published_year: 1954,
      page_count: 423,
      genres: JSON.stringify(['Fantasy', 'Adventure', 'Classics', 'Epic']),
      average_rating: 4.9,
      ratings_count: 450,
      editorial_quote: 'The cornerstone of modern mythmaking and high fantasy.'
    },
    {
      id: 'book_good_omens',
      title: 'Good Omens',
      author: 'Neil Gaiman & Terry Pratchett',
      description: 'According to The Nice and Accurate Prophecies of Agnes Nutter, Witch, the world will end on a Saturday. Next Saturday, in fact. An angel and a demon, who have grown rather fond of the pleasantries of Earth, join forces to stop the apocalypse after misplacing the Antichrist in an English village.',
      cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
      published_year: 1990,
      page_count: 432,
      genres: JSON.stringify(['Fantasy', 'Humor', 'Contemporary', 'Magical Realism']),
      average_rating: 4.7,
      ratings_count: 175,
      editorial_quote: 'A match made in comedic heaven and delightful philosophical absurdity.'
    },
    {
      id: 'book_pride_prejudice',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'The romantic clash between the opinionated Elizabeth Bennet and her proud beau, Mr. Darcy, is a splendid performance of civilized sparring. Austen’s radiant wit sparkles as her characters dance a delicate quadrille of flirtation, social intrigue, and profound self-discovery.',
      cover_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      published_year: 1813,
      page_count: 279,
      genres: JSON.stringify(['Classics', 'Romance', 'Literary Fiction']),
      average_rating: 4.8,
      ratings_count: 520,
      editorial_quote: 'Ageless wit, unmatched dialogue, and enduring romantic tension.'
    },
    {
      id: 'book_station_eleven',
      title: 'Station Eleven',
      author: 'Emily St. John Mandel',
      description: 'Set in the eerie days of civilization’s collapse after a swine flu pandemic, Station Eleven tells the spellbinding story of a traveling troupe of actors and musicians dedicated to keeping the remnants of art and humanity alive: "Because survival is insufficient."',
      cover_url: 'https://images.unsplash.com/photo-1507842229451-7f01be8510ab?auto=format&fit=crop&w=600&q=80',
      published_year: 2014,
      page_count: 333,
      genres: JSON.stringify(['Dystopian', 'Science Fiction', 'Literary Fiction']),
      average_rating: 4.6,
      ratings_count: 130,
      editorial_quote: 'A luminous and poignant meditation on art, grief, and human connection.'
    },
    {
      id: 'book_normal_people',
      title: 'Normal People',
      author: 'Sally Rooney',
      description: 'Connell and Marianne grew up in the same small town in the west of Ireland, but the similarities end there. At school, Connell is popular and well liked, while Marianne is a loner. But when the two strike up a conversation, something life-changing begins that follows them into Trinity College Dublin.',
      cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      published_year: 2018,
      page_count: 273,
      genres: JSON.stringify(['Contemporary', 'Literary Fiction', 'Romance']),
      average_rating: 4.3,
      ratings_count: 210,
      editorial_quote: 'Intimate, raw, and observant portrayal of young intimacy.'
    },
    {
      id: 'book_god_small_things',
      title: 'The God of Small Things',
      author: 'Arundhati Roy',
      description: 'Set in Ayemenem, Kerala, this Booker Prize-winning novel explores how small, seemingly insignificant things affect who should be loved, and how, and how much. A sensory and heartbreaking story of family secrets, caste boundaries, and childhood resilience.',
      cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
      published_year: 1997,
      page_count: 340,
      genres: JSON.stringify(['Literary Fiction', 'Indian Literature', 'Classics']),
      average_rating: 4.7,
      ratings_count: 140,
      editorial_quote: 'Lush linguistic mastery with indelible emotional weight.'
    },
    {
      id: 'book_midnight_library',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things' + " would be if you had made other choices.",
      cover_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
      published_year: 2020,
      page_count: 304,
      genres: JSON.stringify(['Magical Realism', 'Contemporary', 'Fantasy', 'Fiction']),
      average_rating: 4.5,
      ratings_count: 320,
      editorial_quote: 'A warm, comforting inquiry into regret and possibilities.'
    },
    {
      id: 'book_sharp_objects',
      title: 'Sharp Objects',
      author: 'Gillian Flynn',
      description: 'Fresh from a brief stay at a psych hospital, journalist Camille Preaker faces a troubling assignment: she must return to her tiny hometown to cover the unsolved murders of two young girls. Back in Wind Gap, Missouri, Camille is confronted by family demons and dark secrets.',
      cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
      published_year: 2006,
      page_count: 254,
      genres: JSON.stringify(['Thriller', 'Psychological Fiction', 'Mystery', 'Crime']),
      average_rating: 4.5,
      ratings_count: 160,
      editorial_quote: 'Southern gothic dread rendered with chilling razor precision.'
    }
  ];

  const bookStmt = db.prepare(`
    INSERT INTO books (id, title, author, description, cover_url, published_year, page_count, genres, average_rating, ratings_count, editorial_quote)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const b of books) {
    bookStmt.run(b.id, b.title, b.author, b.description, b.cover_url, b.published_year, b.page_count, b.genres, b.average_rating, b.ratings_count, b.editorial_quote);
  }

  // Seed Adaptations
  const adaptations = [
    {
      id: 'adp_dune_2021',
      book_id: 'book_dune',
      title: 'Dune (2021)',
      type: 'Movie',
      director_or_creator: 'Denis Villeneuve',
      cast_summary: 'Timothée Chalamet, Rebecca Ferguson, Oscar Isaac, Zendaya, Jason Momoa',
      release_year: 2021,
      poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      synopsis: 'Feature adaptation of Frank Herbert’s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
      book_votes: 68,
      screen_votes: 82,
      faithfulness_score: 4.7,
      casting_score: 4.9,
      story_score: 4.8,
      overall_score: 4.9,
      ratings_count: 150
    },
    {
      id: 'adp_dune_part_two',
      book_id: 'book_dune',
      title: 'Dune: Part Two (2024)',
      type: 'Movie',
      director_or_creator: 'Denis Villeneuve',
      cast_summary: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Austin Butler',
      release_year: 2024,
      poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between the love of his life and the fate of the universe.',
      book_votes: 55,
      screen_votes: 95,
      faithfulness_score: 4.6,
      casting_score: 4.9,
      story_score: 4.9,
      overall_score: 4.9,
      ratings_count: 180
    },
    {
      id: 'adp_gone_girl_2014',
      book_id: 'book_gone_girl',
      title: 'Gone Girl (2014)',
      type: 'Movie',
      director_or_creator: 'David Fincher',
      cast_summary: 'Ben Affleck, Rosamund Pike, Neil Patrick Harris, Carrie Coon',
      release_year: 2014,
      poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      synopsis: 'With his wife’s disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it’s suspected that he may not be innocent.',
      book_votes: 60,
      screen_votes: 75,
      faithfulness_score: 4.8,
      casting_score: 4.9,
      story_score: 4.8,
      overall_score: 4.8,
      ratings_count: 135
    },
    {
      id: 'adp_the_book_thief_2013',
      book_id: 'book_the_book_thief',
      title: 'The Book Thief (2013)',
      type: 'Movie',
      director_or_creator: 'Brian Percival',
      cast_summary: 'Sophie Nélisse, Geoffrey Rush, Emily Watson, Ben Schnetzer',
      release_year: 2013,
      poster_url: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80',
      synopsis: 'While subjected to the horrors of World War II Germany, young Liesel finds solace by stealing books and sharing them with others.',
      book_votes: 110,
      screen_votes: 42,
      faithfulness_score: 4.3,
      casting_score: 4.6,
      story_score: 4.2,
      overall_score: 4.4,
      ratings_count: 98
    },
    {
      id: 'adp_fellowship_2001',
      book_id: 'book_fellowship',
      title: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
      type: 'Movie',
      director_or_creator: 'Peter Jackson',
      cast_summary: 'Elijah Wood, Ian McKellen, Viggo Mortensen, Orlando Bloom, Sean Astin',
      release_year: 2001,
      poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      synopsis: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
      book_votes: 85,
      screen_votes: 140,
      faithfulness_score: 4.9,
      casting_score: 5.0,
      story_score: 5.0,
      overall_score: 5.0,
      ratings_count: 220
    },
    {
      id: 'adp_good_omens_2019',
      book_id: 'book_good_omens',
      title: 'Good Omens (2019)',
      type: 'TV Series',
      director_or_creator: 'Douglas Mackinnon & Neil Gaiman',
      cast_summary: 'David Tennant, Michael Sheen, Jon Hamm, Frances McDormand',
      release_year: 2019,
      poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      synopsis: 'A fast-living demon and a fussy angel who have formed an unlikely camaraderie must team up to find a way to save the world as the Apocalypse nears.',
      book_votes: 45,
      screen_votes: 65,
      faithfulness_score: 4.8,
      casting_score: 5.0,
      story_score: 4.7,
      overall_score: 4.8,
      ratings_count: 110
    },
    {
      id: 'adp_pride_prejudice_2005',
      book_id: 'book_pride_prejudice',
      title: 'Pride & Prejudice (2005)',
      type: 'Movie',
      director_or_creator: 'Joe Wright',
      cast_summary: 'Keira Knightley, Matthew Macfadyen, Brenda Blethyn, Donald Sutherland',
      release_year: 2005,
      poster_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
      synopsis: 'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.',
      book_votes: 90,
      screen_votes: 105,
      faithfulness_score: 4.5,
      casting_score: 4.9,
      story_score: 4.8,
      overall_score: 4.8,
      ratings_count: 160
    },
    {
      id: 'adp_station_eleven_2021',
      book_id: 'book_station_eleven',
      title: 'Station Eleven (2021)',
      type: 'Miniseries',
      director_or_creator: 'Patrick Somerville',
      cast_summary: 'Mackenzie Davis, Himesh Patel, Matilda Lawler, Gael García Bernal',
      release_year: 2021,
      poster_url: 'https://images.unsplash.com/photo-1507842229451-7f01be8510ab?auto=format&fit=crop&w=600&q=80',
      synopsis: 'A post-apocalyptic saga spanning multiple timelines, this limited series tells the stories of survivors of a devastating flu as they attempt to rebuild and reimagine the world anew while holding on to the best of what\'s been lost.',
      book_votes: 40,
      screen_votes: 55,
      faithfulness_score: 4.4,
      casting_score: 4.8,
      story_score: 4.9,
      overall_score: 4.8,
      ratings_count: 85
    },
    {
      id: 'adp_sharp_objects_2018',
      book_id: 'book_sharp_objects',
      title: 'Sharp Objects (2018)',
      type: 'Miniseries',
      director_or_creator: 'Jean-Marc Vallée',
      cast_summary: 'Amy Adams, Patricia Clarkson, Eliza Scanlen, Chris Messina',
      release_year: 2018,
      poster_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80',
      synopsis: 'A reporter confronts the psychological demons from her past when she returns to her hometown to cover a violent murder.',
      book_votes: 50,
      screen_votes: 70,
      faithfulness_score: 4.7,
      casting_score: 4.9,
      story_score: 4.8,
      overall_score: 4.8,
      ratings_count: 95
    }
  ];

  const adpStmt = db.prepare(`
    INSERT INTO adaptations (id, book_id, title, type, director_or_creator, cast_summary, release_year, poster_url, synopsis, book_votes, screen_votes, faithfulness_score, casting_score, story_score, overall_score, ratings_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of adaptations) {
    adpStmt.run(a.id, a.book_id, a.title, a.type, a.director_or_creator, a.cast_summary, a.release_year, a.poster_url, a.synopsis, a.book_votes, a.screen_votes, a.faithfulness_score, a.casting_score, a.story_score, a.overall_score, a.ratings_count);
  }

  // Seed user libraries and ratings so ShelfMatch and NextRead have real calculated recommendations!
  const seedLibraries = [
    // Elena Vance (Loves Sci-Fi, Dune, Station Eleven, Fellowship)
    { id: 'lib_e1', user_id: 'user_elena_vance', book_id: 'book_dune', shelf: 'completed', current_page: 688, is_favorite: 1, started_at: '2026-10-01', completed_at: '2026-10-15' },
    { id: 'lib_e2', user_id: 'user_elena_vance', book_id: 'book_station_eleven', shelf: 'completed', current_page: 333, is_favorite: 1, started_at: '2026-10-16', completed_at: '2026-10-24' },
    { id: 'lib_e3', user_id: 'user_elena_vance', book_id: 'book_fellowship', shelf: 'completed', current_page: 423, is_favorite: 0, started_at: '2026-10-25', completed_at: '2026-11-05' },
    { id: 'lib_e4', user_id: 'user_elena_vance', book_id: 'book_good_omens', shelf: 'currently_reading', current_page: 210, is_favorite: 0, started_at: '2026-11-10', completed_at: null },
    { id: 'lib_e5', user_id: 'user_elena_vance', book_id: 'book_the_book_thief', shelf: 'want_to_read', current_page: 0, is_favorite: 0, started_at: null, completed_at: null },

    // Marcus Thorne (Loves Thrillers, Gone Girl, Sharp Objects)
    { id: 'lib_m1', user_id: 'user_marcus_thorne', book_id: 'book_gone_girl', shelf: 'completed', current_page: 432, is_favorite: 1, started_at: '2026-09-01', completed_at: '2026-09-10' },
    { id: 'lib_m2', user_id: 'user_marcus_thorne', book_id: 'book_sharp_objects', shelf: 'completed', current_page: 254, is_favorite: 1, started_at: '2026-09-15', completed_at: '2026-09-22' },
    { id: 'lib_m3', user_id: 'user_marcus_thorne', book_id: 'book_dune', shelf: 'completed', current_page: 688, is_favorite: 0, started_at: '2026-10-01', completed_at: '2026-10-20' },
    { id: 'lib_m4', user_id: 'user_marcus_thorne', book_id: 'book_station_eleven', shelf: 'currently_reading', current_page: 150, is_favorite: 0, started_at: '2026-11-12', completed_at: null },

    // Aria Chen (Loves Fantasy, Fellowship, Good Omens, The Book Thief, Pride and Prejudice)
    { id: 'lib_a1', user_id: 'user_aria_chen', book_id: 'book_fellowship', shelf: 'completed', current_page: 423, is_favorite: 1, started_at: '2026-08-01', completed_at: '2026-08-15' },
    { id: 'lib_a2', user_id: 'user_aria_chen', book_id: 'book_good_omens', shelf: 'completed', current_page: 432, is_favorite: 1, started_at: '2026-08-20', completed_at: '2026-09-02' },
    { id: 'lib_a3', user_id: 'user_aria_chen', book_id: 'book_the_book_thief', shelf: 'completed', current_page: 552, is_favorite: 1, started_at: '2026-09-10', completed_at: '2026-09-25' },
    { id: 'lib_a4', user_id: 'user_aria_chen', book_id: 'book_dune', shelf: 'completed', current_page: 688, is_favorite: 1, started_at: '2026-10-01', completed_at: '2026-10-22' },
    { id: 'lib_a5', user_id: 'user_aria_chen', book_id: 'book_pride_prejudice', shelf: 'completed', current_page: 279, is_favorite: 0, started_at: '2026-10-25', completed_at: '2026-11-01' }
  ];

  const libStmt = db.prepare(`
    INSERT INTO user_library (id, user_id, book_id, shelf, current_page, is_favorite, started_at, completed_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  for (const l of seedLibraries) {
    libStmt.run(l.id, l.user_id, l.book_id, l.shelf, l.current_page, l.is_favorite, l.started_at, l.completed_at);
  }

  // Seed Ratings & Reviews
  const seedRatings = [
    { id: 'rr_1', user_id: 'user_elena_vance', book_id: 'book_dune', rating: 5, review_title: 'The pinnacle of speculative philosophy and worldbuilding', review_text: 'Frank Herbert created a living, breathing ecosystem and political tragedy. Denis Villeneuve did the impossible by translating the inner mysticism to IMAX.' },
    { id: 'rr_2', user_id: 'user_elena_vance', book_id: 'book_station_eleven', rating: 5, review_title: 'Survival is insufficient. A masterpiece.', review_text: 'One of the most beautifully composed post-apocalyptic tales ever written.' },
    { id: 'rr_3', user_id: 'user_elena_vance', book_id: 'book_fellowship', rating: 4, review_title: 'Grand and poetic mythology', review_text: 'The foundational epic of fantasy literature.' },
    { id: 'rr_4', user_id: 'user_marcus_thorne', book_id: 'book_gone_girl', rating: 5, review_title: 'Amy Dunne is an indelible force of literary villainy', review_text: 'The pacing, the mid-book pivot, the brutal satire of marital expectation—nothing beats Flynn.' },
    { id: 'rr_5', user_id: 'user_marcus_thorne', book_id: 'book_sharp_objects', rating: 5, review_title: 'Claustrophobic southern dread', review_text: 'Flynn at her darkest and most psychologically incisive.' },
    { id: 'rr_6', user_id: 'user_marcus_thorne', book_id: 'book_dune', rating: 4, review_title: 'Fascinating political intrigue', review_text: 'Loved the court intrigue and espionage.' },
    { id: 'rr_7', user_id: 'user_aria_chen', book_id: 'book_fellowship', rating: 5, review_title: 'The standard against which all fantasy is measured', review_text: 'Pure timeless magic on every page.' },
    { id: 'rr_8', user_id: 'user_aria_chen', book_id: 'book_good_omens', rating: 5, review_title: 'Crowley and Aziraphale forever', review_text: 'Hilarious, heart-warming, and sharp.' },
    { id: 'rr_9', user_id: 'user_aria_chen', book_id: 'book_the_book_thief', rating: 5, review_title: 'Poetry written by Death itself', review_text: 'I cried for hours. Markus Zusak constructed a miracle of empathy.' },
    { id: 'rr_10', user_id: 'user_aria_chen', book_id: 'book_dune', rating: 5, review_title: 'Spectacular vision of ecological destiny', review_text: 'Could not put it down. The spice must flow!' }
  ];

  const rrStmt = db.prepare(`
    INSERT INTO ratings_reviews (id, user_id, book_id, rating, review_title, review_text)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const r of seedRatings) {
    rrStmt.run(r.id, r.user_id, r.book_id, r.rating, r.review_title, r.review_text);
  }

  console.log(`[CATALOG SERVICE] Successfully seeded ${books.length} books, ${adaptations.length} adaptations, and reader histories.`);
}

module.exports = { seedCatalog };
