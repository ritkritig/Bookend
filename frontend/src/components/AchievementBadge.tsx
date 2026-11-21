import React from 'react';
import { 
  BookMarked, 
  Library, 
  Flame, 
  Clapperboard, 
  Sparkles, 
  Star, 
  Lock, 
  Award 
} from 'lucide-react';
import { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookMarked': return BookMarked;
      case 'Library': return Library;
      case 'Flame': return Flame;
      case 'Clapperboard': return Clapperboard;
      case 'Sparkles': return Sparkles;
      case 'Star': return Star;
      default: return Award;
    }
  };

  const Icon = getIcon(achievement.icon);

  return (
    <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
      achievement.isUnlocked
        ? 'bg-[#FAF7F2] dark:bg-[#1C1A18] border-[#C5A059] shadow-sm'
        : 'bg-[#F2EEE7]/40 dark:bg-[#151311]/40 border-[#E8E3D9] dark:border-[#282522] opacity-60'
    }`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          achievement.isUnlocked
            ? 'bg-[#C5A059]/20 text-[#C5A059]'
            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>

        {achievement.isUnlocked ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#9E7D3B] dark:text-[#E0C07F]">
            Earned
          </span>
        ) : (
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-editorial text-sm font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
          {achievement.name}
        </h4>
        <p className="text-xs text-[#786F63] dark:text-[#A89F91] mt-1 line-clamp-2 leading-relaxed">
          {achievement.description}
        </p>
      </div>
    </div>
  );
};
