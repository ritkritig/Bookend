export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  favoriteGenres: string[];
  readingGoalYearly: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  published_year: number;
  page_count: number;
  genres: string[];
  average_rating: number;
  ratings_count: number;
  editorial_quote?: string;
}

export interface Adaptation {
  id: string;
  book_id: string;
  title: string;
  type: 'Movie' | 'TV Series' | 'Miniseries';
  director_or_creator: string;
  cast_summary: string;
  release_year: number;
  poster_url: string;
  synopsis: string;
  book_votes: number;
  screen_votes: number;
  totalVotes: number;
  bookPercentage: number;
  screenPercentage: number;
  faithfulness_score: number;
  casting_score: number;
  story_score: number;
  overall_score: number;
  ratings_count: number;
  userVote?: 'book' | 'screen' | null;
  book_title?: string;
  book_author?: string;
  book_cover_url?: string;
}

export interface UserLibraryItem {
  id: string;
  userId: string;
  bookId: string;
  shelf: 'want_to_read' | 'currently_reading' | 'completed';
  currentPage: number;
  isFavorite: boolean;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
  progressPercentage: number;
  book: Book;
  userRating?: number;
  userReview?: string;
}

export interface StoryLabPost {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  book_id?: string;
  book_title?: string;
  adaptation_id?: string;
  adaptation_title?: string;
  category: 'Sequel Idea' | 'Alternate Ending' | 'Fan Theory' | 'Character POV' | 'Adaptation Pitch' | 'Dream Casting' | 'General Story Discussion';
  title: string;
  content: string;
  spoiler_warning: number;
  spoilerWarning?: boolean;
  likes_count: number;
  comments_count: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  created_at: string;
  comments?: StoryLabComment[];
}

export interface StoryLabComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
}

export interface RecommendationResult {
  userId: string;
  tasteVector: Record<string, number>;
  bookRecommendations: {
    book: Book;
    similarity_score: number;
    match_percentage: number;
    reason: string;
  }[];
  adaptationRecommendations: {
    adaptation: Adaptation;
    similarity_score: number;
    match_percentage: number;
    reason: string;
  }[];
}

export interface ShelfMatchItem {
  readerId: string;
  displayName: string;
  avatarUrl: string;
  compatibilityPercentage: number;
  sharedBooksLoved: Book[];
  sharedGenres: string[];
  discoveriesFromReader: Book[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target_count: number;
  current_count: number;
  category: string;
  badge_reward: string;
  isCompleted: boolean;
  progressPercentage: number;
  completed_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria_type: string;
  criteria_value: number;
  isUnlocked: boolean;
  unlocked_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'achievement' | 'challenge' | 'social' | 'system';
  link?: string;
  isRead: boolean;
  created_at: string;
}
