import React, { useState, useEffect } from 'react';
import { Film, Filter, Star, BookOpen } from 'lucide-react';
import { Adaptation } from '../types';
import { api } from '../services/api';
import { AdaptationCard } from '../components/AdaptationCard';

interface PageToScreenPageProps {
  onOpenBook: (bookId: string) => void;
}

export const PageToScreenPage: React.FC<PageToScreenPageProps> = ({ onOpenBook }) => {
  const [adaptations, setAdaptations] = useState<Adaptation[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAdaptations() {
      setLoading(true);
      try {
        const data = await api.getAdaptations(selectedType);
        setAdaptations(data);
      } catch (err) {
        console.error('Error fetching adaptations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdaptations();
  }, [selectedType]);

  const types = ['All', 'Movie', 'TV Series', 'Miniseries'];

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Header */}
      <div className="border-b border-[#E8E3D9] dark:border-[#282522] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1.5">
          <Film className="w-4 h-4" />
          <span>Cinematic Literature Archive</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
          Page to Screen Experience
        </h1>
        <p className="text-xs sm:text-sm text-[#786F63] dark:text-[#A89F91] mt-2 max-w-2xl leading-relaxed">
          Explore the profound dialogue between the written novel and visionary cinematic adaptations. Cast your community vote on book vs screen fidelity, evaluate casting accuracy, and discover how legendary authors were brought to the screen.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              selectedType === t
                ? 'bg-[#722F37] text-white border-[#722F37] shadow-sm'
                : 'bg-[#FAF7F2] dark:bg-[#1A1816] text-[#5C554D] dark:text-[#A89F91] border-[#E8E3D9] dark:border-[#2D2A26] hover:border-[#C5A059]'
            }`}
          >
            {t === 'All' ? 'All Mediums' : t}
          </button>
        ))}
      </div>

      {/* Grid of Adaptations */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-12">
          {[1, 2].map(n => (
            <div key={n} className="h-96 rounded-2xl bg-[#ECE7DE] dark:bg-[#201D1A] animate-pulse" />
          ))}
        </div>
      ) : adaptations.length === 0 ? (
        <div className="py-20 text-center text-xs text-[#8A8175]">
          No adaptations found for this medium category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adaptations.map(adp => (
            <AdaptationCard 
              key={adp.id} 
              adaptation={adp} 
              onOpenBook={onOpenBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};
