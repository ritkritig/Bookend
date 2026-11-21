import React from 'react';
import { Star, BookMarked, CheckCircle, Clock } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  shelfStatus?: 'want_to_read' | 'currently_reading' | 'completed' | null;
  progressPercentage?: number;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onClick, 
  shelfStatus, 
  progressPercentage 
}) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer flex flex-col h-full bg-[#FAF7F2] dark:bg-[#1A1816] rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] overflow-hidden hover:border-[#C5A059] transition-all duration-300 hover:shadow-lg"
    >
      {/* Cover container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#ECE7DE] dark:bg-[#25221E]">
        <img 
          src={book.cover_url} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Shelf status badge */}
        {shelfStatus && (
          <div className="absolute top-2.5 right-2.5">
            {shelfStatus === 'completed' && (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-800/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                <CheckCircle className="w-2.5 h-2.5" /> Finished
              </span>
            )}
            {shelfStatus === 'currently_reading' && (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#722F37]/90 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                <Clock className="w-2.5 h-2.5" /> Reading
              </span>
            )}
            {shelfStatus === 'want_to_read' && (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#C5A059]/90 text-[#1F1D1A] px-2 py-0.5 rounded-full backdrop-blur-sm">
                <BookMarked className="w-2.5 h-2.5" /> Want to Read
              </span>
            )}
          </div>
        )}

        {/* Reading progress bar */}
        {progressPercentage !== undefined && progressPercentage > 0 && progressPercentage < 100 && (
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/40">
            <div 
              className="h-full bg-[#C5A059] transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Book details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-medium mb-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-[#1F1D1A] dark:text-[#EDE8E1] font-semibold">{book.average_rating.toFixed(1)}</span>
            <span className="text-[#8A8175]">({book.ratings_count})</span>
          </div>

          <h3 className="font-editorial text-base font-bold text-[#1F1D1A] dark:text-[#EDE8E1] line-clamp-1 group-hover:text-[#722F37] dark:group-hover:text-[#C5A059] transition-colors">
            {book.title}
          </h3>

          <p className="text-xs text-[#786F63] dark:text-[#A89F91] mt-0.5 line-clamp-1">
            by {book.author}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-[#E8E3D9]/60 dark:border-[#2D2A26]/60 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {book.genres.slice(0, 2).map((g, i) => (
              <span 
                key={i} 
                className="text-[10px] px-2 py-0.5 bg-[#EFEAE1] dark:bg-[#25221E] text-[#6B6357] dark:text-[#A89F91] rounded-md font-medium"
              >
                {g}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-[#8A8175] font-mono">
            {book.published_year}
          </span>
        </div>
      </div>
    </div>
  );
};
