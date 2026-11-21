import React, { useState, useEffect } from 'react';
import { Users, Heart, Sparkles, BookOpen, Check, ArrowRight } from 'lucide-react';
import { ShelfMatchItem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ShelfMatchPageProps {
  onOpenBook: (bookId: string) => void;
}

export const ShelfMatchPage: React.FC<ShelfMatchPageProps> = ({ onOpenBook }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<ShelfMatchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadShelfMatch() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.getShelfMatch(user.id);
        setMatches(res.matches || []);
      } catch (err) {
        console.error('Error fetching ShelfMatch:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShelfMatch();
  }, [user]);

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="border-b border-[#E8E3D9] dark:border-[#282522] pb-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1.5">
          <Users className="w-4 h-4" />
          <span>Reader Compatibility Algorithm</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
          ShelfMatch Reader Synergy
        </h1>
        <p className="text-xs sm:text-sm text-[#786F63] dark:text-[#A89F91] mt-2 max-w-2xl leading-relaxed">
          Discover readers who share your literary sensibilities. We compare 5-star rating overlaps, favorite themes, and reading habits to calculate genuine taste compatibility and discover unread gems from their shelves.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6 py-12">
          {[1, 2].map(n => (
            <div key={n} className="h-64 rounded-2xl bg-[#ECE7DE] dark:bg-[#201D1A] animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <Users className="w-8 h-8 text-[#8A8175] mx-auto opacity-50" />
          <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            Calibrating Reader Compatibility
          </h3>
          <p className="text-xs text-[#8A8175]">
            Rate more books to expand your taste footprint.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {matches.map((match) => (
            <div 
              key={match.readerId}
              className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] shadow-sm space-y-6 hover:border-[#C5A059] transition-all"
            >
              {/* Reader Header & Match Gauge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3D9] dark:border-[#2D2A26] pb-5">
                <div className="flex items-center gap-4">
                  <img 
                    src={match.avatarUrl} 
                    alt={match.displayName} 
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C5A059]"
                  />
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
                      {match.displayName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {match.sharedGenres.map((g, i) => (
                        <span 
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFEAE1] dark:bg-[#25221E] text-[#6B6357] dark:text-[#A89F91] font-medium"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Match Percentage Badge */}
                <div className="flex items-center gap-3 bg-[#EFEAE1]/70 dark:bg-[#25221E] px-4 py-2.5 rounded-2xl border border-[#E8E3D9] dark:border-[#2D2A26] self-start sm:self-auto">
                  <div className="font-editorial text-3xl font-bold text-[#722F37] dark:text-[#C5A059]">
                    {match.compatibilityPercentage}%
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#8A8175] leading-tight">
                    Taste<br />Match
                  </div>
                </div>
              </div>

              {/* Shared Favorites Row */}
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#8A8175] mb-3 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#722F37]" />
                  <span>Books You Both Loved (4 & 5 Star Ratings)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {match.sharedBooksLoved.map(book => (
                    <div 
                      key={book.id}
                      onClick={() => onOpenBook(book.id)}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#151311] border border-[#E8E3D9] dark:border-[#2D2A26] flex items-center gap-2.5 cursor-pointer hover:border-[#722F37] transition-all group"
                    >
                      <img 
                        src={book.cover_url} 
                        alt={book.title} 
                        className="w-8 h-12 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" 
                      />
                      <div className="min-w-0">
                        <div className="font-editorial font-bold text-xs text-[#1F1D1A] dark:text-[#EDE8E1] truncate">
                          {book.title}
                        </div>
                        <div className="text-[10px] text-[#8A8175] truncate">{book.author}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discoveries Row */}
              {match.discoveriesFromReader.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#F5F1E9] dark:bg-[#151311] border border-[#E8E3D9] dark:border-[#2D2A26]">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#722F37] dark:text-[#C5A059] mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Loved By {match.displayName.split(' ')[0]} That You Haven't Read Yet</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {match.discoveriesFromReader.map(book => (
                      <div 
                        key={book.id}
                        onClick={() => onOpenBook(book.id)}
                        className="p-3 rounded-xl bg-white dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] flex items-center gap-3 cursor-pointer hover:border-[#C5A059] transition-all group"
                      >
                        <img 
                          src={book.cover_url} 
                          alt={book.title} 
                          className="w-10 h-14 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-editorial font-bold text-xs text-[#1F1D1A] dark:text-[#EDE8E1] truncate">
                            {book.title}
                          </div>
                          <div className="text-[10px] text-[#8A8175] truncate">{book.author}</div>
                          <div className="text-[10px] text-[#C5A059] font-medium mt-1 flex items-center gap-1">
                            <span>Inspect Novel</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
