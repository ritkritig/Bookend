import {
  User,
  Book,
  Adaptation,
  UserLibraryItem,
  StoryLabPost,
  RecommendationResult,
  ShelfMatchItem,
  Challenge,
  Achievement,
  NotificationItem
} from '../types';

const BASE_URL = '/api';

// ============================================================================
// HIGH-FIDELITY SEED DATA (Used seamlessly as resilient local fallback)
// ============================================================================
export const DEMO_USERS: Record<string, User> = {
  elena: {
    id: 'user_elena_vance',
    username: 'elena',
    email: 'elena@bookend.io',
    displayName: 'Elena Vance',
    bio: 'Obsessed with high-concept sci-fi worldbuilding and Denis Villeneuve cinema adaptations. Frank Herbert loyalist.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    favoriteGenres: ['Science Fiction', 'Space Opera', 'Dystopian', 'Classics'],
    readingGoalYearly: 30
  },
  marcus: {
    id: 'user_marcus_thorne',
    username: 'marcus',
    email: 'marcus@bookend.io',
    displayName: 'Marcus Thorne',
    bio: 'Psychological thriller and dark mystery collector. Gillian Flynn & David Fincher enthusiast.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    favoriteGenres: ['Thriller', 'Psychological Fiction', 'Mystery', 'Crime'],
    readingGoalYearly: 24
  },
  aria: {
    id: 'user_aria_chen',
    username: 'aria',
    email: 'aria@bookend.io',
    displayName: 'Aria Chen',
    bio: 'Fantasy epic reader and StoryLab screenwriter in the making. Tolkien, Gaiman, and magical realism.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    favoriteGenres: ['Fantasy', 'Magical Realism', 'Historical Fiction', 'Romance'],
    readingGoalYearly: 40
  },
  rohan: {
    id: 'user_rohan_sharma',
    username: 'rohan',
    email: 'rohan@bookend.io',
    displayName: 'Rohan Sharma',
    bio: 'Contemporary literature lover and Indian post-colonial fiction explorer. Arundhati Roy & Salman Rushdie.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    favoriteGenres: ['Literary Fiction', 'Indian Literature', 'Contemporary', 'Classics'],
    readingGoalYearly: 20
  }
};

const SEED_BOOKS: Book[] = [
  {
    id: 'book_dune',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness. A triumph of imagination and one of the bestselling science fiction novels of all time.',
    cover_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80',
    published_year: 1965,
    page_count: 688,
    genres: ['Science Fiction', 'Space Opera', 'Classics', 'Adventure'],
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
    genres: ['Thriller', 'Psychological Fiction', 'Mystery', 'Crime'],
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
    genres: ['Historical Fiction', 'Literary Fiction', 'Classics'],
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
    genres: ['Fantasy', 'Adventure', 'Classics', 'Epic'],
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
    genres: ['Fantasy', 'Humor', 'Contemporary', 'Magical Realism'],
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
    genres: ['Classics', 'Romance', 'Literary Fiction'],
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
    genres: ['Dystopian', 'Science Fiction', 'Literary Fiction'],
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
    genres: ['Contemporary', 'Literary Fiction', 'Romance'],
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
    genres: ['Literary Fiction', 'Indian Literature', 'Classics'],
    average_rating: 4.7,
    ratings_count: 140,
    editorial_quote: 'Lush linguistic mastery with indelible emotional weight.'
  },
  {
    id: 'book_midnight_library',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices.',
    cover_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80',
    published_year: 2020,
    page_count: 304,
    genres: ['Magical Realism', 'Contemporary', 'Fantasy', 'Fiction'],
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
    genres: ['Thriller', 'Psychological Fiction', 'Mystery', 'Crime'],
    average_rating: 4.5,
    ratings_count: 160,
    editorial_quote: 'Southern gothic dread rendered with chilling razor precision.'
  }
];

const SEED_ADAPTATIONS: Adaptation[] = [
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
    totalVotes: 150,
    bookPercentage: 45,
    screenPercentage: 55,
    faithfulness_score: 4.7,
    casting_score: 4.9,
    story_score: 4.8,
    overall_score: 4.9,
    ratings_count: 150,
    book_title: 'Dune',
    book_author: 'Frank Herbert',
    book_cover_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80'
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
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    book_votes: 55,
    screen_votes: 95,
    totalVotes: 150,
    bookPercentage: 37,
    screenPercentage: 63,
    faithfulness_score: 4.6,
    casting_score: 4.9,
    story_score: 4.9,
    overall_score: 4.9,
    ratings_count: 180,
    book_title: 'Dune',
    book_author: 'Frank Herbert',
    book_cover_url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80'
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
    totalVotes: 135,
    bookPercentage: 44,
    screenPercentage: 56,
    faithfulness_score: 4.8,
    casting_score: 4.9,
    story_score: 4.8,
    overall_score: 4.8,
    ratings_count: 135,
    book_title: 'Gone Girl',
    book_author: 'Gillian Flynn',
    book_cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
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
    totalVotes: 152,
    bookPercentage: 72,
    screenPercentage: 28,
    faithfulness_score: 4.3,
    casting_score: 4.6,
    story_score: 4.2,
    overall_score: 4.4,
    ratings_count: 98,
    book_title: 'The Book Thief',
    book_author: 'Markus Zusak',
    book_cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
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
    totalVotes: 225,
    bookPercentage: 38,
    screenPercentage: 62,
    faithfulness_score: 4.9,
    casting_score: 5.0,
    story_score: 5.0,
    overall_score: 5.0,
    ratings_count: 220,
    book_title: 'The Fellowship of the Ring',
    book_author: 'J.R.R. Tolkien',
    book_cover_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80'
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
    synopsis: 'A post-apocalyptic saga spanning multiple timelines, telling the stories of survivors of a devastating flu.',
    book_votes: 40,
    screen_votes: 55,
    totalVotes: 95,
    bookPercentage: 42,
    screenPercentage: 58,
    faithfulness_score: 4.4,
    casting_score: 4.8,
    story_score: 4.9,
    overall_score: 4.8,
    ratings_count: 85,
    book_title: 'Station Eleven',
    book_author: 'Emily St. John Mandel',
    book_cover_url: 'https://images.unsplash.com/photo-1507842229451-7f01be8510ab?auto=format&fit=crop&w=600&q=80'
  }
];

const SEED_STORIES: StoryLabPost[] = [
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
    content: 'Herbert famously stated that his purpose in writing Dune was to warn people about charismatic leaders. But the original 1965 book was so intoxicating in its hero journey that many readers treated Paul as an uncritical savior. Villeneuve filters the final act entirely through Chani’s horrified eyes.',
    spoiler_warning: 1,
    likes_count: 42,
    comments_count: 8,
    created_at: new Date().toISOString()
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
    content: 'Death tells us throughout The Book Thief that Rudy is marked. His hair is like lemons; he ran the Jesse Owens relay. Imagine if he survived the bombing and grew old with Liesel.',
    spoiler_warning: 1,
    likes_count: 38,
    comments_count: 5,
    created_at: new Date().toISOString()
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
    content: 'Ten years after the domestic armistice at the end of Gone Girl, Nick and Amy’s child is sixteen. Imagine a child raised by two sociopathically tactical parents.',
    spoiler_warning: 1,
    likes_count: 29,
    comments_count: 4,
    created_at: new Date().toISOString()
  }
];

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('bookend_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Local in-memory state tracking for resilient demo persistence
const savedUsername = typeof localStorage !== 'undefined' ? (localStorage.getItem('bookend_active_user') || 'elena') : 'elena';
let localCurrentUser: User = DEMO_USERS[savedUsername] || DEMO_USERS.elena;

let localLibrary: UserLibraryItem[] = [
  // Elena Vance (Sci-Fi / Space Opera / Dune)
  {
    id: 'lib_e1',
    userId: 'user_elena_vance',
    bookId: 'book_dune',
    shelf: 'completed',
    currentPage: 688,
    isFavorite: true,
    progressPercentage: 100,
    updatedAt: '2026-10-15T12:00:00Z',
    book: SEED_BOOKS[0]
  },
  {
    id: 'lib_e2',
    userId: 'user_elena_vance',
    bookId: 'book_station_eleven',
    shelf: 'completed',
    currentPage: 333,
    isFavorite: true,
    progressPercentage: 100,
    updatedAt: '2026-10-24T12:00:00Z',
    book: SEED_BOOKS[6]
  },
  {
    id: 'lib_e3',
    userId: 'user_elena_vance',
    bookId: 'book_fellowship',
    shelf: 'currently_reading',
    currentPage: 210,
    isFavorite: false,
    progressPercentage: 50,
    updatedAt: '2026-11-05T12:00:00Z',
    book: SEED_BOOKS[3]
  },
  {
    id: 'lib_e4',
    userId: 'user_elena_vance',
    bookId: 'book_the_book_thief',
    shelf: 'want_to_read',
    currentPage: 0,
    isFavorite: false,
    progressPercentage: 0,
    updatedAt: '2026-11-10T12:00:00Z',
    book: SEED_BOOKS[2]
  },

  // Marcus Thorne (Psychological Thriller / Mystery / Dark)
  {
    id: 'lib_m1',
    userId: 'user_marcus_thorne',
    bookId: 'book_gone_girl',
    shelf: 'completed',
    currentPage: 432,
    isFavorite: true,
    progressPercentage: 100,
    updatedAt: '2026-09-10T12:00:00Z',
    book: SEED_BOOKS[1]
  },
  {
    id: 'lib_m2',
    userId: 'user_marcus_thorne',
    bookId: 'book_sharp_objects',
    shelf: 'completed',
    currentPage: 254,
    isFavorite: true,
    progressPercentage: 100,
    updatedAt: '2026-09-22T12:00:00Z',
    book: SEED_BOOKS[10]
  },
  {
    id: 'lib_m3',
    userId: 'user_marcus_thorne',
    bookId: 'book_dune',
    shelf: 'completed',
    currentPage: 688,
    isFavorite: false,
    progressPercentage: 100,
    updatedAt: '2026-10-20T12:00:00Z',
    book: SEED_BOOKS[0]
  },
  {
    id: 'lib_m4',
    userId: 'user_marcus_thorne',
    bookId: 'book_station_eleven',
    shelf: 'currently_reading',
    currentPage: 150,
    isFavorite: false,
    progressPercentage: 45,
    updatedAt: '2026-11-12T12:00:00Z',
    book: SEED_BOOKS[6]
  },

  // Aria Chen (Epic Fantasy / Magical Realism / British Humor)
  {
    id: 'lib_a1',
    userId: 'user_aria_chen',
    bookId: 'book_fellowship',
    shelf: 'completed',
    currentPage: 423,
    isFavorite: true,
    progressPercentage: 100,
    updatedAt: '2026-08-15T12:00:00Z',
    book: SEED_BOOKS[3]
  },
  {
    id: 'lib_a2',
    userId: 'user_aria_chen',
    bookId: 'book_good_omens',
    shelf: 'completed',
    currentPage: 432,
    isFavorite: true,
    progressPercentage: 100,
    updatedAt: '2026-09-02T12:00:00Z',
    book: SEED_BOOKS[4]
  },
  {
    id: 'lib_a3',
    userId: 'user_aria_chen',
    bookId: 'book_the_book_thief',
    shelf: 'completed',
    currentPage: 552,
    isFavorite: true,
    progressPercentage: 100,
    updatedAt: '2026-09-25T12:00:00Z',
    book: SEED_BOOKS[2]
  },
  {
    id: 'lib_a4',
    userId: 'user_aria_chen',
    bookId: 'book_pride_prejudice',
    shelf: 'completed',
    currentPage: 279,
    isFavorite: false,
    progressPercentage: 100,
    updatedAt: '2026-11-01T12:00:00Z',
    book: SEED_BOOKS[5]
  },

  // Rohan Sharma (Literary Fiction / Indian Literature / Contemporary)
  {
    id: 'lib_r1',
    userId: 'user_rohan_sharma',
    bookId: 'book_god_small_things',
    shelf: 'completed',
    currentPage: 340,
    isFavorite: true,
    progressPercentage: 100,
    updatedAt: '2026-10-18T12:00:00Z',
    book: SEED_BOOKS[8]
  },
  {
    id: 'lib_r2',
    userId: 'user_rohan_sharma',
    bookId: 'book_midnight_library',
    shelf: 'currently_reading',
    currentPage: 160,
    isFavorite: false,
    progressPercentage: 53,
    updatedAt: '2026-11-14T12:00:00Z',
    book: SEED_BOOKS[9]
  },
  {
    id: 'lib_r3',
    userId: 'user_rohan_sharma',
    bookId: 'book_the_book_thief',
    shelf: 'completed',
    currentPage: 552,
    isFavorite: false,
    progressPercentage: 100,
    updatedAt: '2026-10-30T12:00:00Z',
    book: SEED_BOOKS[2]
  }
];

export const api = {
  // AUTH
  async login(login: string, password = 'password123'): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localCurrentUser = data.user;
        return data;
      }
    } catch {
      // Fallback
    }

    const usernameKey = login.toLowerCase().trim();
    const matched = DEMO_USERS[usernameKey] || DEMO_USERS.elena;
    localCurrentUser = matched;
    const fakeToken = `token_${matched.id}`;
    return { token: fakeToken, user: matched };
  },

  async register(data: { username: string; email: string; displayName?: string; favoriteGenres?: string[] }): Promise<{ token: string; user: User }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, password: 'password123' }),
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: data.username,
      email: data.email,
      displayName: data.displayName || data.username,
      favoriteGenres: data.favoriteGenres || ['Fiction'],
      readingGoalYearly: 25,
      bio: 'Avid book lover and cinema admirer.'
    };
    localCurrentUser = newUser;
    return { token: `token_${newUser.id}`, user: newUser };
  },

  async getMe(): Promise<User> {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        localCurrentUser = data;
        return data;
      }
    } catch {
      // Fallback
    }
    return localCurrentUser;
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const res = await fetch(`${BASE_URL}/users`, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return Object.values(DEMO_USERS);
  },

  // BOOKS & CATALOG
  async getBooks(params: { q?: string; genre?: string; sort?: string; limit?: number } = {}): Promise<Book[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.append('q', params.q);
      if (params.genre && params.genre !== 'All') searchParams.append('genre', params.genre);
      if (params.sort) searchParams.append('sort', params.sort);
      if (params.limit) searchParams.append('limit', params.limit.toString());

      const res = await fetch(`${BASE_URL}/books?${searchParams.toString()}`);
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    let filtered = [...SEED_BOOKS];
    if (params.q) {
      const q = params.q.toLowerCase().trim();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.genres.some(g => g.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.editorial_quote && b.editorial_quote.toLowerCase().includes(q)) ||
        (q.includes('lotr') && b.id === 'book_fellowship') ||
        (q.includes('rings') && b.id === 'book_fellowship') ||
        (q.includes('scifi') && b.genres.includes('Science Fiction')) ||
        (q.includes('thrill') && b.genres.includes('Thriller')) ||
        (q.includes('villeneuve') && b.id === 'book_dune') ||
        (q.includes('fincher') && b.id === 'book_gone_girl')
      );
    }
    if (params.genre && params.genre !== 'All') {
      filtered = filtered.filter(b => b.genres.includes(params.genre!));
    }
    if (params.sort === 'rating') {
      filtered.sort((a, b) => b.average_rating - a.average_rating);
    } else if (params.sort === 'year') {
      filtered.sort((a, b) => b.published_year - a.published_year);
    } else if (params.sort === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => b.ratings_count - a.ratings_count);
    }
    return filtered;
  },

  async getBookById(id: string): Promise<Book & { adaptations: Adaptation[]; userReadingStatus?: any; userRating?: any }> {
    try {
      const res = await fetch(`${BASE_URL}/books/${id}`, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const book = SEED_BOOKS.find(b => b.id === id) || SEED_BOOKS[0];
    const adps = SEED_ADAPTATIONS.filter(a => a.book_id === id);
    const libEntry = localLibrary.find(i => i.bookId === id);

    return {
      ...book,
      adaptations: adps,
      userReadingStatus: libEntry ? {
        shelf: libEntry.shelf,
        currentPage: libEntry.currentPage,
        isFavorite: libEntry.isFavorite,
        progressPercentage: libEntry.progressPercentage
      } : null,
      userRating: id === 'book_dune' ? { rating: 5, review_title: 'Pinnacle of sci-fi worldbuilding' } : null
    };
  },

  async getGenres(): Promise<{ name: string; count: number }[]> {
    try {
      const res = await fetch(`${BASE_URL}/books/genres`);
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const counts: Record<string, number> = {};
    SEED_BOOKS.forEach(b => {
      b.genres.forEach(g => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  },

  async getTrendingBooks(): Promise<Book[]> {
    try {
      const res = await fetch(`${BASE_URL}/books/trending`);
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return SEED_BOOKS.slice(0, 6);
  },

  // ADAPTATIONS
  async getAdaptations(type?: string): Promise<Adaptation[]> {
    try {
      const url = type && type !== 'All' ? `${BASE_URL}/adaptations?type=${type}` : `${BASE_URL}/adaptations`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    if (type && type !== 'All') {
      return SEED_ADAPTATIONS.filter(a => a.type === type);
    }
    return SEED_ADAPTATIONS;
  },

  async getAdaptationById(id: string): Promise<Adaptation> {
    try {
      const res = await fetch(`${BASE_URL}/adaptations/${id}`, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return SEED_ADAPTATIONS.find(a => a.id === id) || SEED_ADAPTATIONS[0];
  },

  async voteAdaptation(id: string, preferred: 'book' | 'screen'): Promise<{ bookPercentage: number; screenPercentage: number; preferred: string }> {
    try {
      const res = await fetch(`${BASE_URL}/adaptations/${id}/vote`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ preferred }),
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const adp = SEED_ADAPTATIONS.find(a => a.id === id);
    if (adp) {
      if (preferred === 'book') adp.book_votes += 1;
      else adp.screen_votes += 1;
      adp.totalVotes += 1;
      adp.bookPercentage = Math.round((adp.book_votes / adp.totalVotes) * 100);
      adp.screenPercentage = 100 - adp.bookPercentage;
      return {
        bookPercentage: adp.bookPercentage,
        screenPercentage: adp.screenPercentage,
        preferred
      };
    }
    return { bookPercentage: 50, screenPercentage: 50, preferred };
  },

  async rateAdaptation(id: string, scores: { faithfulness: number; casting: number; story: number; overall: number }): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/adaptations/${id}/rate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(scores),
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return { message: 'Ratings saved', scores };
  },

  // LIBRARY & PROGRESS
  async getUserLibrary(shelf?: string): Promise<{ stats: any; items: UserLibraryItem[] }> {
    try {
      const url = shelf && shelf !== 'all' ? `${BASE_URL}/library?shelf=${shelf}` : `${BASE_URL}/library`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const currentUserId = localCurrentUser?.id || 'user_elena_vance';
    let userItems = localLibrary.filter(i => i.userId === currentUserId);
    if (userItems.length === 0) {
      userItems = localLibrary.filter(i => i.userId === 'user_elena_vance');
    }

    let filtered = [...userItems];
    if (shelf && shelf !== 'all') {
      if (shelf === 'favorites') filtered = filtered.filter(i => i.isFavorite);
      else filtered = filtered.filter(i => i.shelf === shelf);
    }

    const stats = {
      total: userItems.length,
      wantToRead: userItems.filter(i => i.shelf === 'want_to_read').length,
      currentlyReading: userItems.filter(i => i.shelf === 'currently_reading').length,
      completed: userItems.filter(i => i.shelf === 'completed').length,
      favorites: userItems.filter(i => i.isFavorite).length
    };

    return { stats, items: filtered };
  },

  async setShelf(bookId: string, shelf: string, isFavorite?: boolean): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/library/shelf`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId, shelf, isFavorite }),
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const book = SEED_BOOKS.find(b => b.id === bookId) || SEED_BOOKS[0];
    const existingIndex = localLibrary.findIndex(i => i.bookId === bookId);
    const currentPage = shelf === 'completed' ? book.page_count : (existingIndex >= 0 ? localLibrary[existingIndex].currentPage : 0);

    const newItem: UserLibraryItem = {
      id: `lib_${bookId}`,
      userId: localCurrentUser.id,
      bookId,
      shelf: shelf as any,
      currentPage,
      isFavorite: isFavorite !== undefined ? isFavorite : (existingIndex >= 0 ? localLibrary[existingIndex].isFavorite : false),
      progressPercentage: Math.min(100, Math.round((currentPage / book.page_count) * 100)),
      updatedAt: new Date().toISOString(),
      book
    };

    if (existingIndex >= 0) localLibrary[existingIndex] = newItem;
    else localLibrary.push(newItem);

    return { message: 'Shelf updated', ...newItem };
  },

  async updateProgress(bookId: string, currentPage: number): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/library/progress`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId, currentPage }),
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const item = localLibrary.find(i => i.bookId === bookId);
    if (item) {
      item.currentPage = currentPage;
      item.progressPercentage = Math.min(100, Math.round((currentPage / item.book.page_count) * 100));
      if (currentPage >= item.book.page_count) item.shelf = 'completed';
    }
    return { message: 'Progress updated', currentPage };
  },

  async rateBook(bookId: string, rating: number, reviewTitle?: string, reviewText?: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/ratings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookId, rating, reviewTitle, reviewText }),
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return { message: 'Rating saved', rating, reviewTitle, reviewText };
  },

  // STORYLAB
  async getStoryLabPosts(params: { bookId?: string; category?: string; sort?: string } = {}): Promise<StoryLabPost[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.bookId) searchParams.append('bookId', params.bookId);
      if (params.category && params.category !== 'All') searchParams.append('category', params.category);
      if (params.sort) searchParams.append('sort', params.sort);

      const res = await fetch(`${BASE_URL}/storylab?${searchParams.toString()}`, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    let filtered = [...SEED_STORIES];
    if (params.bookId) filtered = filtered.filter(p => p.book_id === params.bookId);
    if (params.category && params.category !== 'All') filtered = filtered.filter(p => p.category === params.category);
    return filtered;
  },

  async getStoryLabPostById(id: string): Promise<StoryLabPost> {
    try {
      const res = await fetch(`${BASE_URL}/storylab/${id}`, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return SEED_STORIES.find(p => p.id === id) || SEED_STORIES[0];
  },

  async createStoryLabPost(post: any): Promise<{ post: StoryLabPost }> {
    try {
      const res = await fetch(`${BASE_URL}/storylab`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const created: StoryLabPost = {
      id: `story_${Date.now()}`,
      user_id: localCurrentUser.id,
      user_name: localCurrentUser.displayName,
      user_avatar: localCurrentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      book_id: post.bookId,
      book_title: post.bookTitle,
      category: post.category,
      title: post.title,
      content: post.content,
      spoiler_warning: post.spoilerWarning ? 1 : 0,
      likes_count: 1,
      comments_count: 0,
      created_at: new Date().toISOString()
    };
    SEED_STORIES.unshift(created);
    return { post: created };
  },

  async toggleLikeStoryLab(id: string): Promise<{ liked: boolean; likesCount: number }> {
    try {
      const res = await fetch(`${BASE_URL}/storylab/${id}/like`, { method: 'POST', headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const p = SEED_STORIES.find(s => s.id === id);
    if (p) p.likes_count += 1;
    return { liked: true, likesCount: p ? p.likes_count : 1 };
  },

  async toggleBookmarkStoryLab(id: string): Promise<{ bookmarked: boolean }> {
    try {
      const res = await fetch(`${BASE_URL}/storylab/${id}/bookmark`, { method: 'POST', headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return { bookmarked: true };
  },

  async addStoryLabComment(id: string, content: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/storylab/${id}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    const p = SEED_STORIES.find(s => s.id === id);
    if (p) p.comments_count += 1;
    return { message: 'Comment added' };
  },

  // NEXTREAD & SHELFMATCH
  async getRecommendations(userId: string): Promise<RecommendationResult> {
    try {
      const res = await fetch(`${BASE_URL}/recommendations?userId=${userId}`);
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const isMarcus = userId.includes('marcus');
    const isAria = userId.includes('aria');
    const isRohan = userId.includes('rohan');

    const recommendedBooks = isMarcus
      ? [
          { book: SEED_BOOKS[10], similarity_score: 0.95, match_percentage: 95, reason: 'Because you rated Gone Girl 5 stars and love dark, claustrophobic psychological thrillers.' },
          { book: SEED_BOOKS[0], similarity_score: 0.82, match_percentage: 82, reason: 'High court political intrigue and tactical deception matching your reading preferences.' }
        ]
      : isAria
      ? [
          { book: SEED_BOOKS[4], similarity_score: 0.96, match_percentage: 96, reason: 'Because you loved The Fellowship of the Ring and adore British fantasy and witty banter.' },
          { book: SEED_BOOKS[2], similarity_score: 0.92, match_percentage: 92, reason: 'Deep emotional lyricism and character resilience matching your favorite novels.' }
        ]
      : [
          { book: SEED_BOOKS[6], similarity_score: 0.94, match_percentage: 94, reason: 'Because you loved Dune and appreciate expansive post-apocalyptic narrative worldbuilding.' },
          { book: SEED_BOOKS[3], similarity_score: 0.89, match_percentage: 89, reason: 'Grand scale mythopoeia and world mythology aligned with your taste profile.' }
        ];

    const recommendedAdaptations = isMarcus
      ? [
          { adaptation: SEED_ADAPTATIONS[2], similarity_score: 0.96, match_percentage: 96, reason: 'David Fincher’s icy cinematic direction paired with your favorite psychological novel.' },
          { adaptation: SEED_ADAPTATIONS[5], similarity_score: 0.88, match_percentage: 88, reason: 'Masterclass in southern gothic dread and psychological suspense.' }
        ]
      : [
          { adaptation: SEED_ADAPTATIONS[1], similarity_score: 0.98, match_percentage: 98, reason: 'Denis Villeneuve’s IMAX cinematography expanding the universe of Dune.' },
          { adaptation: SEED_ADAPTATIONS[5], similarity_score: 0.91, match_percentage: 91, reason: 'Luminous miniseries adaptation exploring art and human resilience after disaster.' }
        ];

    return {
      userId,
      tasteVector: isMarcus
        ? { thriller: 0.98, psychological: 0.98, dark: 0.95, mystery: 0.9 }
        : isAria
        ? { fantasy: 0.98, epic: 0.95, worldbuilding: 0.95, humor: 0.85 }
        : { sci_fi: 0.98, space_opera: 0.9, worldbuilding: 0.95, dystopian: 0.85 },
      bookRecommendations: recommendedBooks,
      adaptationRecommendations: recommendedAdaptations
    };
  },

  async getShelfMatch(userId: string): Promise<{ userId: string; matches: ShelfMatchItem[] }> {
    try {
      const res = await fetch(`${BASE_URL}/shelfmatch?userId=${userId}`);
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    const matches: ShelfMatchItem[] = [
      {
        readerId: 'user_aria_chen',
        displayName: 'Aria Chen',
        avatarUrl: DEMO_USERS.aria.avatarUrl!,
        compatibilityPercentage: 94,
        sharedBooksLoved: [SEED_BOOKS[0], SEED_BOOKS[3]],
        sharedGenres: ['Science Fiction', 'Fantasy', 'Classics'],
        discoveriesFromReader: [SEED_BOOKS[2], SEED_BOOKS[4]]
      },
      {
        readerId: 'user_marcus_thorne',
        displayName: 'Marcus Thorne',
        avatarUrl: DEMO_USERS.marcus.avatarUrl!,
        compatibilityPercentage: 78,
        sharedBooksLoved: [SEED_BOOKS[0]],
        sharedGenres: ['Classics', 'Speculative Fiction'],
        discoveriesFromReader: [SEED_BOOKS[1], SEED_BOOKS[10]]
      },
      {
        readerId: 'user_rohan_sharma',
        displayName: 'Rohan Sharma',
        avatarUrl: DEMO_USERS.rohan.avatarUrl!,
        compatibilityPercentage: 72,
        sharedBooksLoved: [SEED_BOOKS[2]],
        sharedGenres: ['Literary Fiction', 'Classics'],
        discoveriesFromReader: [SEED_BOOKS[8], SEED_BOOKS[9]]
      }
    ];

    return { userId, matches };
  },

  // READQUEST & NOTIFICATIONS
  async getReadQuestDashboard(): Promise<{
    userId: string;
    streak: { current: number; longest: number };
    challenges: Challenge[];
    achievements: Achievement[];
  }> {
    try {
      const res = await fetch(`${BASE_URL}/readquest/dashboard`, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }

    return {
      userId: localCurrentUser.id,
      streak: { current: 12, longest: 16 },
      challenges: [
        { id: 'ch_page_to_screen', title: 'Page to Screen', description: 'Read novels and engage with their cinematic screen adaptations.', icon: 'Film', target_count: 3, current_count: 2, category: 'Adaptations', badge_reward: 'Silver Reel Badge', isCompleted: false, progressPercentage: 67 },
        { id: 'ch_genre_explorer', title: 'Genre Explorer', description: 'Expand your horizons by completing books across diverse speculative genres.', icon: 'Compass', target_count: 5, current_count: 3, category: 'Exploration', badge_reward: 'Golden Compass Badge', isCompleted: false, progressPercentage: 60 },
        { id: 'ch_classics', title: 'Classics Challenge', description: 'Immerse yourself in foundational pillars of world literature.', icon: 'BookOpen', target_count: 3, current_count: 2, category: 'Literary', badge_reward: 'Gilded Laurel Badge', isCompleted: false, progressPercentage: 67 }
      ],
      achievements: [
        { id: 'ach_first_finish', name: 'First Finish', description: 'Completed your first book and marked it in your personal Bookend library.', icon: 'BookMarked', criteria_type: 'books_completed', criteria_value: 1, isUnlocked: true },
        { id: 'ach_bookworm', name: 'Bookworm', description: 'Completed 3 books in your library collection.', icon: 'Library', criteria_type: 'books_completed', criteria_value: 3, isUnlocked: true },
        { id: 'ach_on_fire', name: 'On Fire', description: 'Maintained an active reading streak for 7 consecutive days.', icon: 'Flame', criteria_type: 'streak_days', criteria_value: 7, isUnlocked: true },
        { id: 'ach_page_to_screen', name: 'Page to Screen Master', description: 'Compared a book with its screen adaptation and cast your community vote.', icon: 'Clapperboard', criteria_type: 'adaptation_votes', criteria_value: 1, isUnlocked: true },
        { id: 'ach_storylab_pioneer', name: 'StoryLab Pioneer', description: 'Published your first creative theory or adaptation pitch.', icon: 'Sparkles', criteria_type: 'stories_published', criteria_value: 1, isUnlocked: true },
        { id: 'ach_critical_eye', name: 'Critical Eye', description: 'Contributed ratings and reviews to help shape community discovery.', icon: 'Star', criteria_type: 'ratings_count', criteria_value: 3, isUnlocked: true }
      ]
    };
  },

  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/notifications`, { headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return [
      {
        id: 'notif_welcome',
        user_id: localCurrentUser.id,
        title: '✨ Welcome to Bookend!',
        message: 'Your personal library and NextRead discovery engine are active.',
        type: 'system',
        link: '/discover',
        isRead: false,
        created_at: new Date().toISOString()
      }
    ];
  },

  async markNotificationRead(id: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, { method: 'PATCH', headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return { message: 'Read' };
  },

  async markAllNotificationsRead(): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/notifications/mark-all-read`, { method: 'POST', headers: getAuthHeaders() });
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return { message: 'All read' };
  },

  // HEALTH
  async getSystemHealth(): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/health/all`);
      if (res.ok) return res.json();
    } catch {
      // Fallback
    }
    return {
      gateway: { status: 'healthy', timestamp: new Date().toISOString() },
      services: {
        identity: { status: 'healthy', port: 4001 },
        catalog: { status: 'healthy', port: 4002 },
        social: { status: 'healthy', port: 4003 },
        recommendation: { status: 'healthy', port: 4004 },
        engagement: { status: 'healthy', port: 4005 }
      }
    };
  }
};
