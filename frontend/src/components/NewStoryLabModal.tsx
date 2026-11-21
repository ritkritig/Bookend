import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle } from 'lucide-react';
import { Book } from '../types';
import { api } from '../services/api';

interface NewStoryLabModalProps {
  books: Book[];
  defaultBookId?: string;
  onClose: () => void;
  onCreated: () => void;
}

export const NewStoryLabModal: React.FC<NewStoryLabModalProps> = ({
  books,
  defaultBookId,
  onClose,
  onCreated
}) => {
  const [category, setCategory] = useState<string>('Fan Theory');
  const [selectedBookId, setSelectedBookId] = useState<string>(defaultBookId || (books[0]?.id || ''));
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [spoilerWarning, setSpoilerWarning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categories = [
    'Sequel Idea',
    'Alternate Ending',
    'Fan Theory',
    'Character POV',
    'Adaptation Pitch',
    'Dream Casting',
    'General Story Discussion'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const chosenBook = books.find(b => b.id === selectedBookId);

    try {
      await api.createStoryLabPost({
        bookId: selectedBookId,
        bookTitle: chosenBook?.title,
        category,
        title: title.trim(),
        content: content.trim(),
        spoilerWarning
      });
      onCreated();
      onClose();
    } catch (err) {
      console.error('Error creating StoryLab post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FBF9F5] dark:bg-[#1E1B18] rounded-2xl max-w-lg w-full border border-[#E8E3D9] dark:border-[#2D2A26] shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E8E3D9] dark:border-[#2D2A26] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Publish to StoryLab
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-[#8A8175] hover:bg-[#EFEAE1] dark:hover:bg-[#282521]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-[#1F1D1A] dark:text-[#EDE8E1] block mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    category === c
                      ? 'bg-[#722F37] text-white border-[#722F37]'
                      : 'bg-[#FAF7F2] dark:bg-[#151311] text-[#6B6357] dark:text-[#A89F91] border-[#E8E3D9] dark:border-[#2D2A26] hover:border-[#722F37]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Connected Book */}
          <div>
            <label className="text-xs font-semibold text-[#1F1D1A] dark:text-[#EDE8E1] block mb-1">
              Associated Book
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#151311] text-[#1F1D1A] dark:text-[#EDE8E1]"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} by {b.author}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-[#1F1D1A] dark:text-[#EDE8E1] block mb-1">
              Title / Hook
            </label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why Denis Villeneuve altered Chani's perspective in Dune"
              className="w-full text-xs px-3 py-2 rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#151311] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-[#1F1D1A] dark:text-[#EDE8E1] block mb-1">
              Theory / Pitch Details
            </label>
            <textarea 
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Draft your creative reasoning, character motives, or adaptation vision..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#151311] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Spoiler Warning */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFEAE1]/60 dark:bg-[#25221E] border border-[#E8E3D9] dark:border-[#2D2A26]">
            <div className="flex items-center gap-2 text-xs font-medium text-[#1F1D1A] dark:text-[#EDE8E1]">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Mark as containing Spoilers</span>
            </div>
            <input 
              type="checkbox"
              checked={spoilerWarning}
              onChange={(e) => setSpoilerWarning(e.target.checked)}
              className="w-4 h-4 accent-[#722F37] rounded"
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
              {isSubmitting ? 'Publishing...' : 'Publish to Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
