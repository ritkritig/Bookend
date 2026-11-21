import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Book } from '../types';
import { api } from '../services/api';

interface ReviewModalProps {
  book: Book;
  initialRating?: number;
  initialReviewTitle?: string;
  initialReviewText?: string;
  onClose: () => void;
  onReviewed: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  book,
  initialRating = 5,
  initialReviewTitle = '',
  initialReviewText = '',
  onClose,
  onReviewed
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>(initialReviewTitle);
  const [text, setText] = useState<string>(initialReviewText);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.rateBook(book.id, rating, title, text);
      onReviewed();
      onClose();
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FBF9F5] dark:bg-[#1E1B18] rounded-2xl max-w-md w-full border border-[#E8E3D9] dark:border-[#2D2A26] shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E8E3D9] dark:border-[#2D2A26] pb-3">
          <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            Rate & Review
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-[#8A8175] hover:bg-[#EFEAE1] dark:hover:bg-[#282521]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="font-editorial font-bold text-sm text-[#1F1D1A] dark:text-[#EDE8E1]">
              {book.title}
            </div>
            <div className="text-xs text-[#8A8175]">by {book.author}</div>
          </div>

          {/* Star selector */}
          <div className="flex items-center gap-1.5 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <Star className={`w-6 h-6 ${
                  (hoverRating || rating) >= star
                    ? 'text-[#C5A059] fill-[#C5A059]'
                    : 'text-zinc-300 dark:text-zinc-700'
                }`} />
              </button>
            ))}
            <span className="text-xs font-semibold ml-2 text-[#722F37] dark:text-[#C5A059]">
              {rating} of 5 Stars
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1F1D1A] dark:text-[#EDE8E1] block mb-1">
              Headline
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Masterclass in atmosphere and pacing"
              className="w-full text-xs px-3 py-2 rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#151311] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#1F1D1A] dark:text-[#EDE8E1] block mb-1">
              Your Review
            </label>
            <textarea 
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts on the prose, character arcs, or thematic depth..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#151311] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="pt-3 border-t border-[#E8E3D9] dark:border-[#2D2A26] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B6357]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#722F37] text-white hover:bg-[#8B3A44] transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
