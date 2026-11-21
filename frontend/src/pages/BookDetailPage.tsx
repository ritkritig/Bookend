import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  BookOpen, 
  Film, 
  Sparkles, 
  PenTool, 
  Clock, 
  CheckCircle, 
  Heart, 
  Plus, 
  MessageSquare,
  Share2
} from 'lucide-react';
import { Book, Adaptation, StoryLabPost } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AdaptationCard } from '../components/AdaptationCard';
import { StoryLabCard } from '../components/StoryLabCard';
import { ReadingProgressModal } from '../components/ReadingProgressModal';
import { ReviewModal } from '../components/ReviewModal';
import { NewStoryLabModal } from '../components/NewStoryLabModal';

interface BookDetailPageProps {
  bookId: string;
  onBack: () => void;
  onOpenStoryLab: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ 
  bookId, 
  onBack, 
  onOpenStoryLab,
  onNavigate 
}) => {
  const { user } = useAuth();
  const [book, setBook] = useState<any | null>(null);
  const [adaptations, setAdaptations] = useState<Adaptation[]>([]);
  const [storylabPosts, setStorylabPosts] = useState<StoryLabPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showStoryLabModal, setShowStoryLabModal] = useState<boolean>(false);

  const loadBookDetails = async () => {
    try {
      const data = await api.getBookById(bookId);
      setBook(data);
      setAdaptations(data.adaptations || []);

      const stories = await api.getStoryLabPosts({ bookId });
      setStorylabPosts(stories);
    } catch (err) {
      console.error('Error fetching book detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookDetails();
  }, [bookId]);

  if (loading || !book) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#722F37] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#8A8175]">Retrieving literary metadata...</p>
      </div>
    );
  }

  const readingStatus = book.userReadingStatus;
  const userRating = book.userRating;

  return (
    <div className="space-y-12 pb-16">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-medium text-[#786F63] dark:text-[#A89F91] hover:text-[#1F1D1A] dark:hover:text-[#EDE8E1] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to catalog</span>
      </button>

      {/* Main Panoramic Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 items-start">
        {/* Cover Column */}
        <div className="flex flex-col items-center sm:items-start space-y-4">
          <div className="w-56 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-[#E8E3D9] dark:border-[#2D2A26] book-cover-tilt">
            <img 
              src={book.cover_url} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick Action Button for Personal Library */}
          <button
            onClick={() => setShowProgressModal(true)}
            className="w-56 sm:w-64 py-3 rounded-xl text-xs font-semibold bg-[#722F37] text-white hover:bg-[#8B3A44] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {readingStatus ? `On Shelf: ${readingStatus.shelf.replace('_', ' ')}` : 'Add to Personal Library'}
            </span>
          </button>
        </div>

        {/* Details Column */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {book.genres.map((g: string, i: number) => (
                <span 
                  key={i} 
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EFEAE1] dark:bg-[#25221E] text-[#6B6357] dark:text-[#A89F91] font-medium"
                >
                  {g}
                </span>
              ))}
              <span className="text-xs text-[#8A8175] font-mono">
                {book.published_year} • {book.page_count} pages
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1] leading-tight">
              {book.title}
            </h1>

            <p className="font-editorial text-lg text-[#786F63] dark:text-[#C5A059] mt-1">
              by <span className="font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">{book.author}</span>
            </p>
          </div>

          {/* Rating Snapshot */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26]">
            <div className="flex items-center gap-1.5 text-[#C5A059]">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
                {book.average_rating.toFixed(1)}
              </span>
            </div>
            <div className="text-xs text-[#8A8175] border-l border-[#E8E3D9] dark:border-[#2D2A26] pl-4">
              <div>Community Discovery Score</div>
              <div>{book.ratings_count} verified reader ratings</div>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#C5A059] text-[#722F37] dark:text-[#C5A059] hover:bg-[#C5A059]/10 transition-colors"
              >
                {userRating ? 'Edit Your Rating' : 'Rate this Book'}
              </button>
            </div>
          </div>

          {/* Editorial quote */}
          {book.editorial_quote && (
            <blockquote className="border-l-2 border-[#722F37] dark:border-[#C5A059] pl-4 py-1 font-editorial italic text-base text-[#5C554D] dark:text-[#D1C9BC]">
              "{book.editorial_quote}"
            </blockquote>
          )}

          {/* Synopsis */}
          <div>
            <h3 className="font-editorial text-sm font-bold text-[#1F1D1A] dark:text-[#EDE8E1] uppercase tracking-wider mb-2">
              Synopsis
            </h3>
            <p className="text-xs sm:text-sm text-[#5C554D] dark:text-[#A89F91] leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Active reading status card if shelved */}
          {readingStatus && (
            <div className="p-4 rounded-xl bg-[#EFEAE1]/60 dark:bg-[#25221E] border border-[#E8E3D9] dark:border-[#2D2A26] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1F1D1A] dark:text-[#EDE8E1] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Your Reading Progress</span>
                </span>
                <span className="font-mono text-[#722F37] dark:text-[#C5A059] font-bold">
                  {readingStatus.currentPage} / {book.page_count} pages ({readingStatus.progressPercentage}%)
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#722F37] dark:bg-[#C5A059]"
                  style={{ width: `${readingStatus.progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen Adaptations (Page to Screen Signature Integration) */}
      <section className="space-y-4 pt-6 border-t border-[#E8E3D9] dark:border-[#282522]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1">
              <Film className="w-3.5 h-3.5" />
              <span>Page to Screen Discovery</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Cinematic Adaptations
            </h2>
          </div>
        </div>

        {adaptations.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] text-center space-y-2">
            <Film className="w-6 h-6 text-[#8A8175] mx-auto opacity-50" />
            <p className="text-xs text-[#8A8175]">
              No authorized screen adaptations registered in the archive yet.
            </p>
            <button 
              onClick={() => setShowStoryLabModal(true)}
              className="text-xs text-[#722F37] dark:text-[#C5A059] font-medium hover:underline inline-flex items-center gap-1"
            >
              <PenTool className="w-3 h-3" />
              <span>Pitch your dream cast or miniseries adaptation in StoryLab</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adaptations.map(adp => (
              <AdaptationCard key={adp.id} adaptation={adp} />
            ))}
          </div>
        )}
      </section>

      {/* Connected StoryLab Discussions & Fan Theories */}
      <section className="space-y-4 pt-6 border-t border-[#E8E3D9] dark:border-[#282522]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>StoryLab Community</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Theories & Alternate Endings
            </h2>
          </div>

          <button
            onClick={() => setShowStoryLabModal(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#722F37] text-white hover:bg-[#8B3A44] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Theory</span>
          </button>
        </div>

        {storylabPosts.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] text-center space-y-2">
            <Sparkles className="w-6 h-6 text-[#8A8175] mx-auto opacity-50" />
            <p className="text-xs text-[#8A8175]">
              Be the first reader to pitch an alternate ending, character POV, or sequel idea for {book.title}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storylabPosts.map(post => (
              <StoryLabCard 
                key={post.id} 
                post={post} 
                onOpenDetail={onOpenStoryLab}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {showProgressModal && (
        <ReadingProgressModal 
          book={book}
          initialShelf={readingStatus?.shelf || 'currently_reading'}
          initialPage={readingStatus?.currentPage || 0}
          initialFavorite={readingStatus?.isFavorite || false}
          onClose={() => setShowProgressModal(false)}
          onUpdated={loadBookDetails}
        />
      )}

      {showReviewModal && (
        <ReviewModal 
          book={book}
          initialRating={userRating?.rating || 5}
          initialReviewTitle={userRating?.review_title || ''}
          initialReviewText={userRating?.review_text || ''}
          onClose={() => setShowReviewModal(false)}
          onReviewed={loadBookDetails}
        />
      )}

      {showStoryLabModal && (
        <NewStoryLabModal 
          books={[book]}
          defaultBookId={book.id}
          onClose={() => setShowStoryLabModal(false)}
          onCreated={loadBookDetails}
        />
      )}
    </div>
  );
};
