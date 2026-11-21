import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Flame, 
  Target, 
  CheckCircle, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Film, 
  Globe, 
  Eye, 
  Feather,
  Lock
} from 'lucide-react';
import { Challenge, Achievement } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AchievementBadge } from '../components/AchievementBadge';

export const ReadQuestPage: React.FC = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<{ current: number; longest: number }>({ current: 1, longest: 1 });
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReadQuest() {
      if (!user) return;
      setLoading(true);
      try {
        const data = await api.getReadQuestDashboard();
        setStreak(data.streak);
        setChallenges(data.challenges);
        setAchievements(data.achievements);
      } catch (err) {
        console.error('Error loading ReadQuest dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReadQuest();
  }, [user]);

  const getChallengeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Film': return Film;
      case 'Compass': return Compass;
      case 'BookOpen': return BookOpen;
      case 'Feather': return Feather;
      case 'Globe': return Globe;
      case 'Eye': return Eye;
      default: return Sparkles;
    }
  };

  const completedChallenges = challenges.filter(c => c.isCompleted).length;
  const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="border-b border-[#E8E3D9] dark:border-[#282522] pb-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1.5">
          <Award className="w-4 h-4" />
          <span>Gamified Reading System</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
          ReadQuest Challenges & Milestones
        </h1>
        <p className="text-xs sm:text-sm text-[#786F63] dark:text-[#A89F91] mt-2 max-w-2xl leading-relaxed">
          Track your yearly reading journey, maintain active reading streaks, complete themed literary quests, and unlock earned achievement badges.
        </p>
      </div>

      {/* Stats Deck: Yearly Goal & Streaks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak card */}
        <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="font-editorial text-3xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              {streak.current} Days
            </div>
            <div className="text-xs text-[#8A8175] mt-0.5">
              Active Streak (Best: {streak.longest}d)
            </div>
          </div>
        </div>

        {/* Yearly Goal */}
        <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#722F37]/10 text-[#722F37] dark:text-[#E8A5AC] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="font-editorial text-3xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              {user?.readingGoalYearly || 25} Books
            </div>
            <div className="text-xs text-[#8A8175] mt-0.5">
              Yearly Reading Commitment
            </div>
          </div>
        </div>

        {/* Achievements Earned */}
        <div className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="font-editorial text-3xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
              {unlockedAchievements} / {achievements.length}
            </div>
            <div className="text-xs text-[#8A8175] mt-0.5">
              Achievements Unlocked
            </div>
          </div>
        </div>
      </div>

      {/* Themed Quests & Challenges */}
      <section className="space-y-6">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            Active Reading Challenges
          </h2>
          <p className="text-xs text-[#8A8175] mt-0.5">
            Quests automatically advance when you finish books, cast adaptation votes, or rate titles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map(c => {
            const Icon = getChallengeIcon(c.icon);
            return (
              <div 
                key={c.id}
                className="p-6 rounded-3xl bg-[#FAF7F2] dark:bg-[#1A1816] border border-[#E8E3D9] dark:border-[#2D2A26] space-y-4 shadow-sm hover:border-[#C5A059] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EFEAE1] dark:bg-[#25221E] text-[#722F37] dark:text-[#C5A059] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-base font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
                        {c.title}
                      </h3>
                      <span className="text-[10px] text-[#8A8175] uppercase tracking-wider font-semibold">
                        {c.category}
                      </span>
                    </div>
                  </div>

                  {c.isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-white shadow-sm">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-[#722F37] dark:text-[#C5A059]">
                      {c.current_count} / {c.target_count}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#5C554D] dark:text-[#A89F91] leading-relaxed">
                  {c.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#722F37] dark:bg-[#C5A059] transition-all duration-500"
                      style={{ width: `${c.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8A8175]">
                    <span>Reward: {c.badge_reward}</span>
                    <span>{c.progressPercentage}% Complete</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievements Badges Showcase */}
      <section className="space-y-6 pt-6 border-t border-[#E8E3D9] dark:border-[#282522]">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            Badges of Literary Distinction
          </h2>
          <p className="text-xs text-[#8A8175] mt-0.5">
            Badges are strictly earned through genuine system activity and domain events
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map(ach => (
            <AchievementBadge key={ach.id} achievement={ach} />
          ))}
        </div>
      </section>
    </div>
  );
};
