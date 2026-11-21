import React, { useState } from 'react';
import { Film, BookOpen, Star, ThumbsUp, Check, Award } from 'lucide-react';
import { Adaptation } from '../types';
import { api } from '../services/api';

interface AdaptationCardProps {
  adaptation: Adaptation;
  onOpenBook?: (bookId: string) => void;
}

export const AdaptationCard: React.FC<AdaptationCardProps> = ({ adaptation, onOpenBook }) => {
  const [userVote, setUserVote] = useState<'book' | 'screen' | null>(adaptation.userVote || null);
  const [bookPct, setBookPct] = useState(adaptation.bookPercentage || 50);
  const [screenPct, setScreenPct] = useState(adaptation.screenPercentage || 50);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (preferred: 'book' | 'screen') => {
    if (isVoting) return;
    setIsVoting(true);
    setUserVote(preferred);

    try {
      const res = await api.voteAdaptation(adaptation.id, preferred);
      setBookPct(res.bookPercentage);
      setScreenPct(res.screenPercentage);
    } catch (err) {
      console.error('Error voting on adaptation:', err);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#1A1816] rounded-2xl border border-[#E8E3D9] dark:border-[#2D2A26] overflow-hidden shadow-sm hover:border-[#C5A059] transition-all">
      {/* Visual Duet Header: Book Cover & Movie Poster */}
      <div className="relative grid grid-cols-2 h-56 sm:h-64 bg-black overflow-hidden group">
        <div className="relative h-full overflow-hidden border-r border-black/40">
          <img 
            src={adaptation.book_cover_url || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80'} 
            alt="Source Novel" 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-black/60 rounded font-semibold text-[#E8A5AC]">
              Original Book
            </span>
            <div className="font-editorial text-sm font-bold truncate mt-1">
              {adaptation.book_title || 'Novel'}
            </div>
            <div className="text-[10px] text-zinc-300 truncate">by {adaptation.book_author}</div>
          </div>
        </div>

        <div className="relative h-full overflow-hidden">
          <img 
            src={adaptation.poster_url} 
            alt={adaptation.title} 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-black/60 rounded font-semibold text-[#C5A059]">
              {adaptation.type} ({adaptation.release_year})
            </span>
            <div className="font-editorial text-sm font-bold truncate mt-1">
              {adaptation.title}
            </div>
            <div className="text-[10px] text-zinc-300 truncate">Dir: {adaptation.director_or_creator}</div>
          </div>
        </div>

        {/* Central connecting badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1F1D1A] text-[#C5A059] border-2 border-[#C5A059] flex items-center justify-center font-bold text-xs shadow-lg">
          VS
        </div>
      </div>

      {/* Content & Community Preference Voting */}
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[#8A8175] mb-1">
            <span>Key Cast: {adaptation.cast_summary}</span>
          </div>
          <p className="text-xs text-[#6B6357] dark:text-[#A89F91] line-clamp-2 leading-relaxed">
            {adaptation.synopsis}
          </p>
        </div>

        {/* Interactive "Which did you prefer?" Poll */}
        <div className="p-3.5 rounded-xl bg-[#EFEAE1]/70 dark:bg-[#23201D] border border-[#E8E3D9] dark:border-[#2D2A26] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-editorial font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              Which did you prefer?
            </span>
            <span className="text-[10px] text-[#8A8175]">
              {adaptation.totalVotes > 0 ? `${adaptation.totalVotes} reader votes` : 'Cast first vote'}
            </span>
          </div>

          {/* Voting Bar */}
          <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="bg-[#722F37] h-full transition-all duration-500" 
              style={{ width: `${bookPct}%` }}
              title={`Book: ${bookPct}%`}
            />
            <div 
              className="bg-[#C5A059] h-full transition-all duration-500" 
              style={{ width: `${screenPct}%` }}
              title={`Screen: ${screenPct}%`}
            />
          </div>

          {/* Vote Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleVote('book')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                userVote === 'book'
                  ? 'bg-[#722F37] text-white border-[#722F37]'
                  : 'bg-white dark:bg-[#1A1816] text-[#1F1D1A] dark:text-[#EDE8E1] border-[#E8E3D9] dark:border-[#2D2A26] hover:border-[#722F37]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Book ({bookPct}%)</span>
              {userVote === 'book' && <Check className="w-3 h-3 ml-1" />}
            </button>

            <button
              onClick={() => handleVote('screen')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                userVote === 'screen'
                  ? 'bg-[#C5A059] text-[#1F1D1A] border-[#C5A059] font-bold'
                  : 'bg-white dark:bg-[#1A1816] text-[#1F1D1A] dark:text-[#EDE8E1] border-[#E8E3D9] dark:border-[#2D2A26] hover:border-[#C5A059]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Screen ({screenPct}%)</span>
              {userVote === 'screen' && <Check className="w-3 h-3 ml-1" />}
            </button>
          </div>
        </div>

        {/* Adaptation Dimensions */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#151311] border border-[#E8E3D9]/60 dark:border-[#2D2A26]/60">
            <div className="text-[10px] text-[#8A8175] uppercase tracking-wider">Faithfulness</div>
            <div className="font-editorial text-sm font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-0.5">
              {adaptation.faithfulness_score.toFixed(1)} / 5
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#151311] border border-[#E8E3D9]/60 dark:border-[#2D2A26]/60">
            <div className="text-[10px] text-[#8A8175] uppercase tracking-wider">Casting</div>
            <div className="font-editorial text-sm font-bold text-[#1F1D1A] dark:text-[#EDE8E1] mt-0.5">
              {adaptation.casting_score.toFixed(1)} / 5
            </div>
          </div>
          <div className="p-2 rounded-lg bg-[#FAF7F2] dark:bg-[#151311] border border-[#E8E3D9]/60 dark:border-[#2D2A26]/60">
            <div className="text-[10px] text-[#8A8175] uppercase tracking-wider">Overall</div>
            <div className="font-editorial text-sm font-bold text-[#C5A059] mt-0.5">
              {adaptation.overall_score.toFixed(1)} / 5
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
