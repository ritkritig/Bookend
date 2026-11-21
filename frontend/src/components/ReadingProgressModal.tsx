import React, { useState } from 'react';
import { X, CheckCircle, Heart, Bookmark, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Book } from '../types';
import { api } from '../services/api';

interface ReadingProgressModalProps {
  book: Book;
  initialShelf?: string;
  initialPage?: number;
  initialFavorite?: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const ReadingProgressModal: React.FC<ReadingProgressModalProps> = ({
  book,
  initialShelf = 'currently_reading',
  initialPage = 0,
  initialFavorite = false,
  onClose,
  onUpdated
}) => {
  const [shelf, setShelf] = useState<string>(initialShelf);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isFavorite, setIsFavorite] = useState<boolean>(initialFavorite);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const percentage = Math.min(100, Math.round((currentPage / book.page_count) * 100));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.setShelf(book.id, shelf, isFavorite);
      if (shelf !== 'completed' && currentPage > 0) {
        await api.updateProgress(book.id, currentPage);
      }
      if (shelf === 'completed' || currentPage >= book.page_count) {
        // Trigger celebratory confetti for completing a book!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Error saving reading progress:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkCompleted = () => {
    setShelf('completed');
    setCurrentPage(book.page_count);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FBF9F5] dark:bg-[#1E1B18] rounded-2xl max-w-md w-full border border-[#E8E3D9] dark:border-[#2D2A26] shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E3D9] dark:border-[#2D2A26] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#722F37] dark:text-[#C5A059]" />
            <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Reading Shelf & Progress
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-[#8A8175] hover:bg-[#EFEAE1] dark:hover:bg-[#282521]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Book summary */}
        <div className="flex gap-3">
          <img 
            src={book.cover_url} 
            alt={book.title} 
            className="w-14 h-20 object-cover rounded-lg border border-[#E8E3D9] dark:border-[#2D2A26]" 
          />
          <div>
            <h4 className="font-editorial font-bold text-sm text-[#1F1D1A] dark:text-[#EDE8E1] line-clamp-1">
              {book.title}
            </h4>
            <p className="text-xs text-[#8A8175]">by {book.author}</p>
            <p className="text-[11px] text-[#C5A059] mt-1 font-medium">{book.page_count} pages total</p>
          </div>
        </div>

        {/* Shelf Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">
            Choose Shelf
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'want_to_read', label: 'Want to Read' },
              { id: 'currently_reading', label: 'Currently Reading' },
              { id: 'completed', label: 'Completed' }
            ].map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setShelf(s.id);
                  if (s.id === 'completed') setCurrentPage(book.page_count);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  shelf === s.id
                    ? 'bg-[#722F37] text-white border-[#722F37] shadow-sm'
                    : 'bg-[#FAF7F2] dark:bg-[#151311] text-[#1F1D1A] dark:text-[#EDE8E1] border-[#E8E3D9] dark:border-[#2D2A26] hover:border-[#722F37]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Slider (when reading) */}
        {shelf === 'currently_reading' && (
          <div className="space-y-3 p-4 rounded-xl bg-[#EFEAE1]/60 dark:bg-[#25221E] border border-[#E8E3D9] dark:border-[#2D2A26]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">Pages Read</span>
              <span className="font-mono font-bold text-[#722F37] dark:text-[#C5A059]">
                {currentPage} / {book.page_count} ({percentage}%)
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max={book.page_count}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
              className="w-full accent-[#722F37]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleMarkCompleted}
                className="text-xs text-[#722F37] dark:text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Finished Book</span>
              </button>
            </div>
          </div>
        )}

        {/* Favorite toggle */}
        <div className="flex items-center justify-between pt-1">
          <label className="text-xs font-medium text-[#1F1D1A] dark:text-[#EDE8E1] flex items-center gap-2 cursor-pointer">
            <Heart className={`w-4 h-4 ${isFavorite ? 'text-[#722F37] fill-[#722F37]' : 'text-[#8A8175]'}`} />
            <span>Mark as All-Time Favorite</span>
          </label>
          <input 
            type="checkbox"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
            className="w-4 h-4 accent-[#722F37] rounded"
          />
        </div>

        {/* Save button */}
        <div className="pt-3 border-t border-[#E8E3D9] dark:border-[#2D2A26] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#6B6357] hover:bg-[#EFEAE1] dark:hover:bg-[#25221E]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#722F37] text-white hover:bg-[#8B3A44] transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Updating...' : 'Save Shelf'}
          </button>
        </div>
      </div>
    </div>
  );
};
