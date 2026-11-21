import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Film, 
  Sparkles, 
  Users, 
  PenTool, 
  Award, 
  Bookmark, 
  Bell, 
  Activity, 
  Sun, 
  Moon, 
  Check, 
  Search,
  ExternalLink,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { Book } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, isDark, onToggleTheme }) => {
  const { user, switchDemoUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, triggerToast } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search query debounce
  useEffect(() => {
    if (!navSearch.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await api.getBooks({ q: navSearch, limit: 5 });
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [navSearch]);

  const navItems = [
    { id: 'discover', label: 'Discover', icon: BookOpen },
    { id: 'explore', label: 'Books', icon: Search },
    { id: 'page-to-screen', label: 'Page to Screen', icon: Film },
    { id: 'nextread', label: 'NextRead', icon: Sparkles },
    { id: 'shelfmatch', label: 'ShelfMatch', icon: Users },
    { id: 'storylab', label: 'StoryLab', icon: PenTool },
    { id: 'readquest', label: 'ReadQuest', icon: Award },
    { id: 'library', label: 'My Library', icon: Bookmark },
    { id: 'architecture', label: 'Architecture', icon: Activity, badge: 'Live' }
  ];

  const demoUsers = [
    { username: 'elena', name: 'Elena Vance', tag: 'Sci-Fi & Dune' },
    { username: 'marcus', name: 'Marcus Thorne', tag: 'Thrillers & Mystery' },
    { username: 'aria', name: 'Aria Chen', tag: 'Fantasy & LOTR' },
    { username: 'rohan', name: 'Rohan Sharma', tag: 'Literary Fiction' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 dark:bg-[#151311]/90 backdrop-blur-md border-b border-[#E8E3D9] dark:border-[#282522] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('discover')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-md bg-[#722F37] dark:bg-[#8B3A44] flex items-center justify-center text-[#FBF9F5] shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-editorial text-xl font-bold italic">B</span>
            </div>
            <div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-[#1F1D1A] dark:text-[#EDE8E1]">
                Bookend
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-[#722F37] dark:text-[#C5A059] font-medium ml-2 border-l border-[#C5A059]/40 pl-2">
                Page to Screen
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#722F37] text-white shadow-sm'
                      : 'text-[#5C554D] dark:text-[#A89F91] hover:text-[#1F1D1A] dark:hover:text-[#EDE8E1] hover:bg-[#EFEAE1] dark:hover:bg-[#211E1B]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#C5A059] text-[#1F1D1A] font-bold rounded-full ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Search Input */}
          <div ref={searchRef} className="relative hidden md:block w-44 xl:w-56">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8175]" />
              <input 
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onNavigate('explore');
                    setShowSearchDropdown(false);
                  }
                }}
                placeholder="Search Dune, Gone Girl..."
                className="w-full pl-8 pr-7 py-1.5 rounded-full border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#F5F1E9]/80 dark:bg-[#1E1B18]/80 text-xs text-[#1F1D1A] dark:text-[#EDE8E1] focus:outline-none focus:border-[#C5A059] transition-all"
              />
              {navSearch && (
                <button 
                  onClick={() => { setNavSearch(''); setShowSearchDropdown(false); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8175] hover:text-[#1F1D1A]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#FBF9F5] dark:bg-[#1E1B18] rounded-2xl shadow-2xl border border-[#E8E3D9] dark:border-[#2D2A26] py-2 z-50 overflow-hidden">
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#8A8175] border-b border-[#E8E3D9]/60 dark:border-[#2D2A26]/60">
                  Matching Books
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-xs text-center text-[#8A8175]">
                    No matches found for "{navSearch}".
                  </div>
                ) : (
                  searchResults.map(b => (
                    <div 
                      key={b.id}
                      onClick={() => {
                        onNavigate('book-detail', { bookId: b.id });
                        setShowSearchDropdown(false);
                        setNavSearch('');
                      }}
                      className="p-2.5 flex items-center gap-3 hover:bg-[#EFEAE1] dark:hover:bg-[#282521] cursor-pointer transition-colors"
                    >
                      <img src={b.cover_url} alt={b.title} className="w-8 h-12 object-cover rounded shadow-sm shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-editorial font-bold text-xs text-[#1F1D1A] dark:text-[#EDE8E1] truncate">{b.title}</div>
                        <div className="text-[10px] text-[#8A8175] truncate">by {b.author}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#722F37]/10 text-[#722F37] dark:text-[#E8A5AC] font-medium">{b.genres[0]}</span>
                          <span className="text-[10px] text-[#C5A059] font-semibold">★ {b.average_rating}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div 
                  onClick={() => {
                    onNavigate('explore');
                    setShowSearchDropdown(false);
                  }}
                  className="px-3 py-2 text-center text-xs text-[#722F37] dark:text-[#C5A059] font-medium hover:underline cursor-pointer border-t border-[#E8E3D9]/60 dark:border-[#2D2A26]/60 bg-[#F5F1E9]/50"
                >
                  View full catalog on Books page →
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons & Demo User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-[#5C554D] dark:text-[#A89F91] hover:bg-[#EFEAE1] dark:hover:bg-[#211E1B] transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#C5A059]" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Drawer */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2 rounded-full relative text-[#5C554D] dark:text-[#A89F91] hover:bg-[#EFEAE1] dark:hover:bg-[#211E1B] transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#722F37] ring-2 ring-[#FBF9F5] dark:ring-[#151311]" />
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FBF9F5] dark:bg-[#1E1B18] rounded-xl shadow-xl border border-[#E8E3D9] dark:border-[#2D2A26] py-3 z-50">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-[#E8E3D9] dark:border-[#2D2A26]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-editorial font-bold text-sm text-[#1F1D1A] dark:text-[#EDE8E1]">Notifications</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#722F37]/10 text-[#722F37] dark:text-[#E8A5AC] rounded-full font-semibold">
                        {unreadCount} unread
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-xs text-[#C5A059] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E3D9]/60 dark:divide-[#2D2A26]/60">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#8A8175]">No notifications yet.</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.link) onNavigate(n.link.replace('/', ''));
                            setShowNotifs(false);
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-[#EFEAE1] dark:hover:bg-[#282521] transition-colors ${!n.isRead ? 'bg-[#722F37]/5 dark:bg-[#722F37]/10' : ''}`}
                        >
                          <div className="font-medium text-[#1F1D1A] dark:text-[#EDE8E1] flex items-center justify-between">
                            <span>{n.title}</span>
                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#722F37]" />}
                          </div>
                          <p className="text-[#6B6357] dark:text-[#A89F91] mt-1 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-[#8A8175] mt-1 block">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Demo User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-[#E8E3D9] dark:border-[#2D2A26] bg-[#F5F1E9] dark:bg-[#1E1B18] hover:border-[#C5A059] transition-all"
              >
                <img 
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                  alt={user?.displayName || 'Reader'} 
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-[#C5A059]"
                />
                <span className="text-xs font-medium text-[#1F1D1A] dark:text-[#EDE8E1] hidden sm:inline-block max-w-[90px] truncate">
                  {user?.displayName || 'Reader'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8A8175]" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FBF9F5] dark:bg-[#1E1B18] rounded-xl shadow-xl border border-[#E8E3D9] dark:border-[#2D2A26] py-2 z-50">
                  <div className="px-3 py-2 border-b border-[#E8E3D9] dark:border-[#2D2A26]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A8175]">Switch Demo Reader</div>
                    <div className="text-[11px] text-[#5C554D] dark:text-[#A89F91] mt-0.5">Explore tailored NextRead & ShelfMatch results</div>
                  </div>

                  <div className="py-1">
                    {demoUsers.map(u => {
                      const isCurrent = user?.username === u.username;
                      return (
                        <button
                          key={u.username}
                          onClick={() => {
                            switchDemoUser(u.username);
                            setShowUserMenu(false);
                            triggerToast('Reader Profile Switched', `Active reader: ${u.name} (${u.tag})`);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#EFEAE1] dark:hover:bg-[#282521] transition-colors ${
                            isCurrent ? 'bg-[#722F37]/10 text-[#722F37] dark:text-[#E8A5AC] font-semibold' : 'text-[#1F1D1A] dark:text-[#EDE8E1]'
                          }`}
                        >
                          <div>
                            <div>{u.name}</div>
                            <div className="text-[10px] text-[#8A8175] font-normal">{u.tag}</div>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-[#722F37] dark:text-[#C5A059]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-[#E8E3D9] dark:border-[#282522] no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs whitespace-nowrap ${
                isActive
                  ? 'bg-[#722F37] text-white font-medium'
                  : 'text-[#6B6357] dark:text-[#A89F91]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
