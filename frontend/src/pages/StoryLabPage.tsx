import React, { useState, useEffect } from 'react';
import { PenTool, Plus, Filter, Sparkles, SlidersHorizontal, MessageSquare } from 'lucide-react';
import { StoryLabPost, Book } from '../types';
import { api } from '../services/api';
import { StoryLabCard } from '../components/StoryLabCard';
import { NewStoryLabModal } from '../components/NewStoryLabModal';

interface StoryLabPageProps {
  onOpenBook: (bookId: string) => void;
  onOpenDetail?: (id: string) => void;
}

export const StoryLabPage: React.FC<StoryLabPageProps> = ({ onOpenBook, onOpenDetail }) => {
  const [posts, setPosts] = useState<StoryLabPost[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('trending');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Sequel Idea',
    'Alternate Ending',
    'Fan Theory',
    'Character POV',
    'Adaptation Pitch',
    'Dream Casting',
    'General Story Discussion'
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const [storyPosts, allBooks] = await Promise.all([
        api.getStoryLabPosts({ category: selectedCategory, sort: sortBy }),
        api.getBooks({ limit: 100 })
      ]);
      setPosts(storyPosts);
      setBooks(allBooks);
    } catch (err) {
      console.error('Error fetching StoryLab posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-[#E8E3D9] dark:border-[#282522] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#722F37] dark:text-[#C5A059] uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Transformative Literary Community</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            StoryLab Creative Archive
          </h1>
          <p className="text-xs sm:text-sm text-[#786F63] dark:text-[#A89F91] mt-2 max-w-xl leading-relaxed">
            Where readers reimagine what happens after the final page. Pitch adaptation scripts, debate character motivations, explore alternate endings, and theorize unseen sequels.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#722F37] text-white hover:bg-[#8B3A44] transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Creation</span>
        </button>
      </div>

      {/* Categories & Sorting Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-[#722F37] text-white shadow-sm'
                  : 'bg-[#FAF7F2] dark:bg-[#1A1816] text-[#5C554D] dark:text-[#A89F91] hover:border-[#C5A059] border border-[#E8E3D9] dark:border-[#2D2A26]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#8A8175] flex items-center gap-1 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#1A1816] text-[#1F1D1A] dark:text-[#EDE8E1] focus:outline-none focus:border-[#C5A059]"
          >
            <option value="trending">Trending Debates</option>
            <option value="new">Newly Published</option>
            <option value="top">Top Appreciated</option>
          </select>
        </div>
      </div>

      {/* Grid of StoryLab Posts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-12">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-48 rounded-2xl bg-[#ECE7DE] dark:bg-[#201D1A] animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <PenTool className="w-8 h-8 text-[#8A8175] mx-auto opacity-50" />
          <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            No community posts in this category yet
          </h3>
          <p className="text-xs text-[#8A8175]">
            Be the first to draft a theory or pitch!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <StoryLabCard 
              key={post.id} 
              post={post} 
              onOpenBook={onOpenBook}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <NewStoryLabModal 
          books={books}
          onClose={() => setShowModal(false)}
          onCreated={fetchPosts}
        />
      )}
    </div>
  );
};
