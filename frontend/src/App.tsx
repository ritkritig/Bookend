import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { DiscoverPage } from './pages/DiscoverPage';
import { ExplorePage } from './pages/ExplorePage';
import { BookDetailPage } from './pages/BookDetailPage';
import { PageToScreenPage } from './pages/PageToScreenPage';
import { NextReadPage } from './pages/NextReadPage';
import { ShelfMatchPage } from './pages/ShelfMatchPage';
import { StoryLabPage } from './pages/StoryLabPage';
import { ReadQuestPage } from './pages/ReadQuestPage';
import { LibraryPage } from './pages/LibraryPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

// Floating Notification Toast Component
const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast } = useNotifications();
  if (!activeToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#1F1D1A] text-white p-4 rounded-2xl shadow-2xl border border-[#C5A059] flex items-start gap-3 animate-slide-up">
      <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-bold shrink-0">
        ✨
      </div>
      <div className="flex-1">
        <h4 className="font-editorial text-sm font-bold text-[#EDE8E1]">
          {activeToast.title}
        </h4>
        <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2">
          {activeToast.message}
        </p>
      </div>
      <button 
        onClick={dismissToast}
        className="text-zinc-400 hover:text-white text-xs font-semibold p-1"
      >
        ✕
      </button>
    </div>
  );
};

const MainContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('discover');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('bookend_theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bookend_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bookend_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    if (params?.bookId) {
      setSelectedBookId(params.bookId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setCurrentPage('book-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStoryLab = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentPage('storylab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] dark:bg-[#151311] text-[#1F1D1A] dark:text-[#EDE8E1] transition-colors duration-200">
      <Navbar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {currentPage === 'discover' && (
          <DiscoverPage 
            onNavigate={handleNavigate}
            onOpenBook={handleOpenBook}
            onOpenStoryLab={handleOpenStoryLab}
          />
        )}

        {currentPage === 'explore' && (
          <ExplorePage 
            onOpenBook={handleOpenBook}
          />
        )}

        {currentPage === 'book-detail' && selectedBookId && (
          <BookDetailPage 
            bookId={selectedBookId}
            onBack={() => setCurrentPage('explore')}
            onOpenStoryLab={handleOpenStoryLab}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'page-to-screen' && (
          <PageToScreenPage 
            onOpenBook={handleOpenBook}
          />
        )}

        {currentPage === 'nextread' && (
          <NextReadPage 
            onOpenBook={handleOpenBook}
          />
        )}

        {currentPage === 'shelfmatch' && (
          <ShelfMatchPage 
            onOpenBook={handleOpenBook}
          />
        )}

        {currentPage === 'storylab' && (
          <StoryLabPage 
            onOpenBook={handleOpenBook}
            onOpenDetail={(id) => setSelectedStoryId(id)}
          />
        )}

        {currentPage === 'readquest' && (
          <ReadQuestPage />
        )}

        {currentPage === 'library' && (
          <LibraryPage 
            onOpenBook={handleOpenBook}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'architecture' && (
          <ArchitecturePage />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
