import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';
import { Book, UserLibraryItem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookCard } from '../components/BookCard';

interface ExplorePageProps {
  onOpenBook: (bookId: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onOpenBook }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<{ name: string; count: number }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('trending');
  const [libraryItems, setLibraryItems] = useState<UserLibraryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadGenresAndLibrary() {
      try {
        const [gList, lib] = await Promise.all([
          api.getGenres(),
          user ? api.getUserLibrary().catch(() => ({ items: [] })) : Promise.resolve({ items: [] })
        ]);
        setGenres(gList);
        setLibraryItems(lib.items);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    }
    loadGenresAndLibrary();
  }, [user]);

  useEffect(() => {
    async function fetchFilteredBooks() {
      setLoading(true);
      try {
        const results = await api.getBooks({
          q: searchQuery,
          genre: selectedGenre,
          sort: sortBy
        });
        setBooks(results);
      } catch (err) {
        console.error('Error fetching filtered books:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchFilteredBooks, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, sortBy]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
          Book Catalog & Library
        </h1>
        <p className="text-xs sm:text-sm text-[#786F63] dark:text-[#A89F91] mt-1 max-w-xl">
          Search classic epics, psychological thrillers, and acclaimed contemporary narratives. Track progress and discover how stories transition from page to screen.
        </p>
      </div>

      {/* Search Bar & Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8175]" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or keyword (e.g. Dune, Flynn, sci-fi)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#1A1816] text-xs text-[#1F1D1A] dark:text-[#EDE8E1] focus:outline-none focus:border-[#C5A059] shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-[#8A8175] flex items-center gap-1 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#FAF7F2] dark:bg-[#1A1816] text-[#1F1D1A] dark:text-[#EDE8E1] focus:outline-none focus:border-[#C5A059]"
          >
            <option value="trending">Popularity & Trending</option>
            <option value="rating">Highest Rated</option>
            <option value="year">Publication Year</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Quick Search Suggestions */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[#8A8175] text-[11px] font-medium mr-1">Quick Searches:</span>
        {['Dune', 'Gone Girl', 'Fellowship', 'The Book Thief', 'Station Eleven', 'Good Omens', 'Sharp Objects', 'Sci-Fi', 'Thriller'].map(term => (
          <button
            key={term}
            onClick={() => setSearchQuery(term)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] border transition-colors ${
              searchQuery.toLowerCase() === term.toLowerCase()
                ? 'bg-[#C5A059] text-[#1F1D1A] font-semibold border-[#C5A059]'
                : 'bg-[#F5F1E9] dark:bg-[#1E1B18] text-[#5C554D] dark:text-[#A89F91] border-[#E8E3D9] dark:border-[#2D2A26] hover:border-[#C5A059]'
            }`}
          >
            {term}
          </button>
        ))}
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-[11px] text-[#722F37] dark:text-[#E8A5AC] hover:underline font-medium ml-1"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Genre Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedGenre('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedGenre === 'All'
              ? 'bg-[#722F37] text-white shadow-sm'
              : 'bg-[#F5F1E9] dark:bg-[#1E1B18] text-[#5C554D] dark:text-[#A89F91] hover:border-[#C5A059]'
          }`}
        >
          All Genres
        </button>
        {genres.map(g => (
          <button
            key={g.name}
            onClick={() => setSelectedGenre(g.name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedGenre === g.name
                ? 'bg-[#722F37] text-white shadow-sm'
                : 'bg-[#F5F1E9] dark:bg-[#1E1B18] text-[#5C554D] dark:text-[#A89F91] hover:border-[#C5A059]'
            }`}
          >
            {g.name} <span className="text-[10px] opacity-70">({g.count})</span>
          </button>
        ))}
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-12">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="aspect-[2/3] rounded-2xl bg-[#ECE7DE] dark:bg-[#201D1A] animate-pulse" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-[#8A8175] mx-auto opacity-40" />
          <h3 className="font-editorial text-lg font-bold text-[#1F1D1A] dark:text-[#EDE8E1]">
            No matching books found
          </h3>
          <p className="text-xs text-[#8A8175]">
            Try adjusting your search query or selecting a different genre.
          </p>
          <div>
            <button
              onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#722F37] text-white hover:bg-[#8B3A44] transition-colors mt-2"
            >
              Reset Filters & Show All Books
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {books.map(book => {
            const userEntry = libraryItems.find(i => i.bookId === book.id);
            return (
              <BookCard 
                key={book.id} 
                book={book} 
                onClick={() => onOpenBook(book.id)}
                shelfStatus={userEntry?.shelf}
                progressPercentage={userEntry?.progressPercentage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
