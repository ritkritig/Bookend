import React, { useState, useEffect } from 'react';
import { Sparkles, Film, BookOpen, ArrowRight, RefreshCw } from 'lucide-react';
import { RecommendationResult, Book, Adaptation } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AdaptationCard } from '../components/AdaptationCard';

interface NextReadPageProps {
  onOpenBook: (bookId: string) => void;
}

export const NextReadPage: React.FC<NextReadPageProps> = ({ onOpenBook }) => {
  const { user } = useAuth();
  const [data, setData] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRecommendations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.getRecommendations(user.id);
      setData(res);
    } catch (err) {
      console.error('Error fetching NextRead recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="border-b border-[#E8E3D9] dark:border-[#282522] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>FastAPI NextRead Engine</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            NextRead Personalized Discovery
          </h1>
          <p className="text-xs sm:text-sm text-[#786F63] dark:text-[#A89F91] mt-2 max-w-xl">
            Explainable recommendations generated through multidimensional content vectors, rating signals, and cross-media narrative affinities.
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-xs font-medium border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#1A1816] hover:border-[#C5A059] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalculate Taste</span>
        </button>
      </div>

      {/* Reader Taste Vector Deck */}
      {data && data.tasteVector && (
        <div className="p-5 rounded-2xl bg-[#F5F1E9] dark:bg-[#1E1B18] border border-[#E8E3D9] dark:border-[#2D2A26] space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-editorial font-bold text-sm text-[#1F1D1A] dark:text-[#EDE8E1]">
              Your Current Reading Taste Vector
            </span>
            <span className="text-[10px] text-[#8A8175]">
              Recalculated on book completions & ratings
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(data.tasteVector).map(([tag, score]) => (
              <div 
                key={tag}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#151311] border border-[#E8E3D9] dark:border-[#2D2A26] flex items-center gap-2 text-xs"
              >
                <span className="capitalize font-medium text-[#1F1D1A] dark:text-[#EDE8E1]">
                  {tag.replace('_', ' ')}
                </span>
                <span className="font-mono text-[11px] font-bold text-[#722F37] dark:text-[#C5A059]">
                  {Math.round(score * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Recommendations with Explainable Labels */}
      <section className="space-y-6">
        <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
          Books Aligned With Your Profile
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-36 rounded-2xl bg-[#ECE7DE] dark:bg-[#201D1A] animate-pulse" />
            ))}
          </div>
        ) : !data || data.bookRecommendations.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8A8175]">
            Rate books or mark them finished in your library to calibrate your recommendation model.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.bookRecommendations.map((rec, i) => (
              <div 
                key={i}
                onClick={() => onOpenBook(rec.book.id)}
                className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] flex gap-4 cursor-pointer hover:border-[#C5A059] transition-all group shadow-sm"
              >
                <img 
                  src={rec.book.cover_url} 
                  alt={rec.book.title} 
                  className="w-24 h-36 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#8E6D2B] dark:text-[#E0C07F] font-bold">
                        {rec.match_percentage}% Vector Match
                      </span>
                      <span className="text-xs text-[#8A8175] font-mono">{rec.book.published_year}</span>
                    </div>

                    <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-1.5 group-hover:text-[#722F37] transition-colors line-clamp-1">
                      {rec.book.title}
                    </h3>
                    <p className="text-xs text-[#786F63]">by {rec.book.author}</p>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-[#EFEAE1]/70 dark:bg-[#25221E] border border-[#E8E3D9]/60 dark:border-[#2D2A26]/60">
                    <span className="text-[10px] uppercase font-bold text-[#722F37] dark:text-[#C5A059] block mb-0.5 tracking-wider">
                      Why Recommended
                    </span>
                    <p className="text-xs text-[#5C554D] dark:text-[#D1C9BC] italic leading-relaxed">
                      "{rec.reason}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cross-Media Adaptation Recommendations */}
      {data && data.adaptationRecommendations && data.adaptationRecommendations.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-[#E8E3D9] dark:border-[#282522]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1">
              <Film className="w-3.5 h-3.5" />
              <span>Cross-Media Curation</span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Screen Adaptations Matching Your Taste
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.adaptationRecommendations.map((rec, i) => (
              <div key={i} className="space-y-2">
                <div className="text-xs text-[#722F37] dark:text-[#C5A059] font-medium italic">
                  "{rec.reason}"
                </div>
                <AdaptationCard 
                  adaptation={rec.adaptation} 
                  onOpenBook={onOpenBook} 
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
