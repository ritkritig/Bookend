import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Film, 
  BookOpen, 
  ArrowRight, 
  Flame, 
  Award, 
  Star, 
  Clock, 
  CheckCircle,
  Plus
} from 'lucide-react';
import { Book, Adaptation, StoryLabPost, UserLibraryItem, RecommendationResult } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookCard } from '../components/BookCard';
import { AdaptationCard } from '../components/AdaptationCard';
import { StoryLabCard } from '../components/StoryLabCard';

interface DiscoverPageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenBook: (bookId: string) => void;
  onOpenStoryLab: (storyId: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ 
  onNavigate, 
  onOpenBook,
  onOpenStoryLab 
}) => {
  const { user } = useAuth();
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [adaptations, setAdaptations] = useState<Adaptation[]>([]);
  const [storylabPosts, setStorylabPosts] = useState<StoryLabPost[]>([]);
  const [libraryItems, setLibraryItems] = useState<UserLibraryItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [books, adps, stories] = await Promise.all([
          api.getTrendingBooks(),
          api.getAdaptations(),
          api.getStoryLabPosts({ sort: 'trending' })
        ]);
        setTrendingBooks(books);
        setAdaptations(adps);
        setStorylabPosts(stories);

        if (user) {
          const [lib, recs] = await Promise.all([
            api.getUserLibrary().catch(() => ({ stats: {}, items: [] })),
            api.getRecommendations(user.id).catch(() => null)
          ]);
          setLibraryItems(lib.items);
          setRecommendations(recs);
        }
      } catch (err) {
        console.error('Error loading discover feed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const currentlyReading = libraryItems.filter(i => i.shelf === 'currently_reading');
  const userLeadBookId = user?.username === 'marcus' ? 'book_gone_girl' : user?.username === 'aria' ? 'book_fellowship' : user?.username === 'rohan' ? 'book_god_small_things' : 'book_dune';
  const featuredBook = trendingBooks.find(b => b.id === userLeadBookId) || trendingBooks.find(b => b.id === 'book_dune') || trendingBooks[0];

  return (
    <div className="space-y-12 pb-12">
      {/* Active Reader Taste Banner */}
      {user && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#F5F1E9] dark:bg-[#1C1A17] border border-[#E8E3D9] dark:border-[#2D2A26] text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <img 
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={user.displayName} 
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#C5A059]" 
            />
            <div>
              <span className="font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">
                Active Profile: {user.displayName}
              </span>
              <span className="text-[#8A8175] ml-2 hidden sm:inline">
                Taste Profile: {user.favoriteGenres?.join(', ')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-[11px] text-[#722F37] dark:text-[#C5A059] font-medium">
            <span>Goal: {user.readingGoalYearly} books</span>
            <span>•</span>
            <button onClick={() => onNavigate('library')} className="hover:underline flex items-center gap-1">
              My Library ({libraryItems.length}) →
            </button>
          </div>
        </div>
      )}

      {/* Editorial Lead Hero */}
      {featuredBook && (
        <section className="relative rounded-3xl overflow-hidden bg-[#1F1D1A] text-white border border-[#2D2A26] shadow-xl">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80" 
              alt="Arrakis Desert"
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#171513] via-[#171513]/90 to-transparent z-10" />

          <div className="relative z-20 max-w-4xl px-6 py-12 sm:px-12 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#722F37] text-white">
                  Signature Odyssey
                </span>
                <span className="text-xs text-[#C5A059] font-medium flex items-center gap-1">
                  <Film className="w-3.5 h-3.5" /> Book ↔ Screen Showcase
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#EDE8E1] leading-tight">
                {featuredBook.title}
              </h1>

              <p className="text-xs text-[#C5A059] font-serif italic text-base">
                "{featuredBook.editorial_quote || 'A monumental epic that redefined science fiction worldbuilding forever.'}"
              </p>

              <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed max-w-xl">
                {featuredBook.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onOpenBook(featuredBook.id)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#C5A059] text-[#1F1D1A] hover:bg-[#D4B26F] transition-all flex items-center gap-2 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Book & Adaptations</span>
                </button>

                <button
                  onClick={() => onNavigate('page-to-screen')}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <span>Vote on Villeneuve's Films</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tactical cover mockup */}
            <div className="hidden md:flex justify-center">
              <div 
                onClick={() => onOpenBook(featuredBook.id)}
                className="w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/20 book-cover-tilt cursor-pointer"
              >
                <img 
                  src={featuredBook.cover_url} 
                  alt={featuredBook.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Continue Reading Bar (if user has active books) */}
      {currentlyReading.length > 0 && (
        <section className="p-5 rounded-2xl bg-[#F5F1E9] dark:bg-[#1E1B18] border border-[#E8E3D9] dark:border-[#2D2A26] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#722F37] dark:text-[#C5A059]" />
              <h3 className="font-editorial text-base font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
                Continue Reading
              </h3>
            </div>
            <button 
              onClick={() => onNavigate('library')}
              className="text-xs text-[#722F37] dark:text-[#C5A059] font-medium hover:underline"
            >
              View Shelves →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentlyReading.map((item) => (
              <div 
                key={item.id}
                onClick={() => onOpenBook(item.bookId)}
                className="p-3 rounded-xl bg-white dark:bg-[#151311] border border-[#E8E3D9] dark:border-[#2D2A26] flex items-center gap-3 cursor-pointer hover:border-[#C5A059] transition-all"
              >
                <img 
                  src={item.book.cover_url} 
                  alt={item.book.title} 
                  className="w-10 h-14 object-cover rounded shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-editorial font-bold text-xs text-[#1F1D1A] dark:text-[#EDE8E1] truncate">
                    {item.book.title}
                  </div>
                  <div className="text-[10px] text-[#8A8175] truncate">by {item.book.author}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#722F37] dark:bg-[#C5A059]"
                        style={{ width: `${item.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#8A8175]">
                      {item.progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NextRead Personalized Spotlight */}
      {recommendations && recommendations.bookRecommendations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NextRead Algorithm</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
                Recommended For Your Taste
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('nextread')}
              className="text-xs text-[#722F37] dark:text-[#C5A059] font-medium hover:underline flex items-center gap-1"
            >
              <span>Explore All Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.bookRecommendations.slice(0, 2).map((rec, i) => (
              <div 
                key={i}
                onClick={() => onOpenBook(rec.book.id)}
                className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] flex gap-4 cursor-pointer hover:border-[#C5A059] transition-all group"
              >
                <img 
                  src={rec.book.cover_url} 
                  alt={rec.book.title} 
                  className="w-20 h-28 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#9E7D3B] dark:text-[#E0C07F] font-semibold">
                      {rec.match_percentage}% Taste Match
                    </span>
                    <h3 className="font-editorial text-base font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-1 group-hover:text-[#722F37] transition-colors">
                      {rec.book.title}
                    </h3>
                    <p className="text-xs text-[#786F63]">by {rec.book.author}</p>
                  </div>
                  <p className="text-xs text-[#5C554D] dark:text-[#A89F91] italic bg-[#EFEAE1]/50 dark:bg-[#25221E]/60 p-2 rounded-lg mt-2 border border-[#E8E3D9]/40 dark:border-[#2D2A26]/40">
                    "{rec.reason}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Page to Screen Duets Carousel */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1">
              <Film className="w-3.5 h-3.5" />
              <span>Page to Screen</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Which Did You Prefer?
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('page-to-screen')}
            className="text-xs text-[#722F37] dark:text-[#C5A059] font-medium hover:underline flex items-center gap-1"
          >
            <span>All Adaptations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adaptations.slice(0, 2).map((adp) => (
            <AdaptationCard 
              key={adp.id} 
              adaptation={adp} 
              onOpenBook={onOpenBook} 
            />
          ))}
        </div>
      </section>

      {/* Trending Books */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Trending in the Library
            </h2>
            <p className="text-xs text-[#8A8175] mt-0.5">
              Acclaimed works driving discussion across the Bookend ecosystem
            </p>
          </div>
          <button 
            onClick={() => onNavigate('explore')}
            className="text-xs text-[#722F37] dark:text-[#C5A059] font-medium hover:underline flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingBooks.slice(0, 4).map((book) => {
            const userEntry = libraryItems.find(i => i.bookId === book.id);
            return (
              <BookCard 
                key={book.id} 
                book={book} 
                onClick={() => onOpenBook(book.id)}
                shelfStatus={userEntry?.shelf}
                progressPercentage={userEntry?.progressPercentage}
              />
            );
          })}
        </div>
      </section>

      {/* StoryLab Trending Discussions */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Creative Fan Theory Community</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              StoryLab Debates & Alternate Endings
            </h2>
          </div>
          <button 
            onClick={() => onNavigate('storylab')}
            className="text-xs text-[#722F37] dark:text-[#C5A059] font-medium hover:underline flex items-center gap-1"
          >
            <span>Enter StoryLab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storylabPosts.slice(0, 2).map((post) => (
            <StoryLabCard 
              key={post.id} 
              post={post} 
              onOpenDetail={onOpenStoryLab}
              onOpenBook={onOpenBook}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
