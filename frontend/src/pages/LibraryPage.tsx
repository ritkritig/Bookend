import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, CheckCircle, Heart, Star, BookOpen, Plus, SlidersHorizontal } from 'lucide-react';
import { UserLibraryItem, Book } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookCard } from '../components/BookCard';

interface LibraryPageProps {
  onOpenBook: (bookId: string) => void;
  onNavigate: (page: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onOpenBook, onNavigate }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<UserLibraryItem[]>([]);
  const [stats, setStats] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLibrary = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getUserLibrary(activeTab);
      setItems(data.items || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Error fetching personal library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [user, activeTab]);

  const tabs = [
    { id: 'all', label: 'All Books', count: stats.total || 0 },
    { id: 'currently_reading', label: 'Currently Reading', count: stats.currentlyReading || 0 },
    { id: 'want_to_read', label: 'Want to Read', count: stats.wantToRead || 0 },
    { id: 'completed', label: 'Completed', count: stats.completed || 0 },
    { id: 'favorites', label: 'Favorites', count: stats.favorites || 0 },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Header & Stats Strip */}
      <div className="border-b border-[#E8E3D9] dark:border-[#282522] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1.5">
            <Bookmark className="w-4 h-4" />
            <span>Curated Reading Sanctuary</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            {user?.displayName}'s Shelves
          </h1>
          <p className="text-xs sm:text-sm text-[#786F63] dark:text-[#A89F91] mt-2 max-w-xl">
            Manage your personal library, track page-by-page progress, and revisit past reviews.
          </p>
        </div>

        <button
          onClick={() => onNavigate('explore')}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#722F37] text-white hover:bg-[#8B3A44] transition-all flex items-center gap-1.5 shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Discover New Books</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#E8E3D9] dark:border-[#282522]">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === t.id
                ? 'border-[#722F37] text-[#722F37] dark:border-[#C5A059] dark:text-[#C5A059]'
                : 'border-transparent text-[#786F63] dark:text-[#A89F91] hover:text-[#1F1D1A] dark:hover:text-[#EDE8E1]'
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EFEAE1] dark:bg-[#25221E] text-[#6B6357] dark:text-[#A89F91]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="aspect-[2/3] rounded-2xl bg-[#ECE7DE] dark:bg-[#201D1A] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-[#8A8175] mx-auto opacity-40" />
          <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            No books on this shelf yet
          </h3>
          <p className="text-xs text-[#8A8175]">
            Browse the discovery catalog to add titles to your personal shelves.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map(item => (
            <div key={item.id} className="relative group flex flex-col">
              <BookCard 
                book={item.book}
                onClick={() => onOpenBook(item.bookId)}
                shelfStatus={item.shelf}
                progressPercentage={item.progressPercentage}
              />
              {item.userRating && (
                <div className="mt-2 text-[11px] text-[#C5A059] flex items-center gap-1 px-1 font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  <span>You rated {item.userRating} stars</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
