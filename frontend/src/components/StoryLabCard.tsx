import React, { useState } from 'react';
import { Heart, MessageSquare, Bookmark, AlertTriangle, Eye, EyeOff, BookOpen, Film } from 'lucide-react';
import { StoryLabPost } from '../types';
import { api } from '../services/api';

interface StoryLabCardProps {
  post: StoryLabPost;
  onOpenDetail?: (id: string) => void;
  onOpenBook?: (bookId: string) => void;
}

export const StoryLabCard: React.FC<StoryLabCardProps> = ({ post, onOpenDetail, onOpenBook }) => {
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isBookmarked, setIsBookmarked] = useState(Boolean(post.isBookmarked));
  const [revealed, setRevealed] = useState(!post.spoiler_warning);

  const categoryColors: Record<string, string> = {
    'Sequel Idea': 'bg-emerald-900/10 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300 border-emerald-800/20',
    'Alternate Ending': 'bg-[#722F37]/10 text-[#722F37] dark:bg-[#722F37]/20 dark:text-[#E8A5AC] border-[#722F37]/20',
    'Fan Theory': 'bg-blue-900/10 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300 border-blue-800/20',
    'Character POV': 'bg-amber-900/10 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300 border-amber-800/20',
    'Adaptation Pitch': 'bg-[#C5A059]/15 text-[#8F7032] dark:text-[#E0C07F] border-[#C5A059]/30',
    'Dream Casting': 'bg-purple-900/10 text-purple-800 dark:bg-purple-500/10 dark:text-purple-300 border-purple-800/20',
    'General Story Discussion': 'bg-zinc-800/10 text-zinc-800 dark:text-zinc-300 border-zinc-800/20'
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
    try {
      await api.toggleLikeStoryLab(post.id);
    } catch {
      // Revert if error
      setIsLiked(isLiked);
      setLikesCount(post.likes_count);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    try {
      await api.toggleBookmarkStoryLab(post.id);
    } catch {
      setIsBookmarked(isBookmarked);
    }
  };

  return (
    <div 
      onClick={() => onOpenDetail && onOpenDetail(post.id)}
      className="bg-[#FAF7F2] dark:bg-[#1A1816] rounded-2xl border border-[#E8E3D9] dark:border-[#2D2A26] p-5 hover:border-[#C5A059] transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-sm"
    >
      <div>
        {/* Author Header & Category Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <img 
              src={post.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={post.user_name} 
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#C5A059]"
            />
            <div>
              <span className="text-xs font-semibold text-[#1F1D1A] dark:text-[#EDE8E1]">
                {post.user_name}
              </span>
              <span className="text-[10px] text-[#8A8175] block">
                {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${categoryColors[post.category] || categoryColors['General Story Discussion']}`}>
            {post.category}
          </span>
        </div>

        {/* Connected Book or Adaptation Tag */}
        {(post.book_title || post.adaptation_title) && (
          <div className="flex items-center gap-1.5 mb-2.5">
            {post.book_title && (
              <span 
                onClick={(e) => {
                  if (post.book_id && onOpenBook) {
                    e.stopPropagation();
                    onOpenBook(post.book_id);
                  }
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#722F37] dark:text-[#C5A059] hover:underline"
              >
                <BookOpen className="w-3 h-3" />
                <span>{post.book_title}</span>
              </span>
            )}
            {post.adaptation_title && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8A8175]">
                <Film className="w-3 h-3" />
                <span>{post.adaptation_title}</span>
              </span>
            )}
          </div>
        )}

        {/* Post Title */}
        <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1] group-hover:text-[#722F37] dark:group-hover:text-[#C5A059] transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Content with Spoiler Blur Protection */}
        <div className="relative mt-2">
          {post.spoiler_warning && !revealed ? (
            <div 
              onClick={(e) => { e.stopPropagation(); setRevealed(true); }}
              className="py-6 px-4 rounded-xl bg-[#EFEAE1]/60 dark:bg-[#25221E] border border-dashed border-[#C5A059]/40 text-center cursor-pointer hover:border-[#C5A059] transition-colors"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#E8A5AC]">
                <AlertTriangle className="w-4 h-4" />
                <span>Spoiler Warning</span>
              </div>
              <p className="text-[11px] text-[#8A8175] mt-1">Click to reveal theory</p>
            </div>
          ) : (
            <p className="text-xs text-[#5C554D] dark:text-[#A89F91] leading-relaxed line-clamp-3">
              {post.content}
            </p>
          )}
        </div>
      </div>

      {/* Footer Interactions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E8E3D9]/60 dark:border-[#2D2A26]/60 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked ? 'text-[#722F37] font-semibold' : 'text-[#8A8175] hover:text-[#722F37]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <div className="flex items-center gap-1.5 text-[#8A8175]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.comments_count}</span>
          </div>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-1 rounded-full transition-colors ${
            isBookmarked ? 'text-[#C5A059]' : 'text-[#8A8175] hover:text-[#C5A059]'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};
