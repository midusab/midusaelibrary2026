import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { BookCover } from './BookCover';
import { formatPrice, slugify } from '../utils/helpers';
import { 
  Search, 
  X, 
  Star, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (book: Book) => void;
  onSelectCategory: (category: string) => void;
}

const POPULAR_SEARCHES = [
  'Atomic Discipline',
  'Dopamine',
  'Micro-SaaS',
  'Finance',
  'Psychology',
  'AI Executive',
  'Cashflow',
  'Stoic'
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  books,
  onSelectBook,
  onSelectCategory
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('midusa_recent_searches');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return ['Atomic Discipline', 'Micro-SaaS', 'Psychology'];
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent if needed
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSaveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...recentSearches.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('midusa_recent_searches', JSON.stringify(updated));
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('midusa_recent_searches');
  };

  const handleBookClick = (book: Book) => {
    handleSaveSearch(query || book.title);
    onSelectBook(book);
    onClose();
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    handleSaveSearch(tag);
  };

  // Filtered books
  const trimmedQuery = query.trim().toLowerCase();
  const searchResults = trimmedQuery
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(trimmedQuery) ||
          b.subtitle.toLowerCase().includes(trimmedQuery) ||
          b.author.toLowerCase().includes(trimmedQuery) ||
          b.category.toLowerCase().includes(trimmedQuery) ||
          b.description.toLowerCase().includes(trimmedQuery)
      )
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 pb-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-100 animate-slideDown">
        
        {/* Search Bar Input */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/90 gap-3">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchResults.length > 0) {
                handleBookClick(searchResults[0]);
              }
            }}
            placeholder="Search by title, author, keyword, or category..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-base sm:text-lg focus:outline-hidden font-body"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono font-medium text-slate-400 bg-slate-800 rounded-md border border-slate-700 hover:text-white transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Query Results */}
          {trimmedQuery ? (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider font-semibold text-slate-400">
                <span>Books Found ({searchResults.length})</span>
                <span className="text-blue-400 font-normal normal-case">Press Enter for 1st result</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className="group flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-blue-500/40 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-16 shrink-0 rounded-md overflow-hidden shadow-sm">
                        <BookCover book={book} size="sm" showBadge={false} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {book.category}
                          </span>
                          <div className="flex items-center text-amber-400 text-xs gap-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{book.rating}</span>
                          </div>
                        </div>
                        <h4 className="font-heading font-bold text-sm sm:text-base text-slate-100 group-hover:text-blue-400 truncate mt-0.5">
                          {book.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-body truncate">
                          By {book.author}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-heading font-bold text-emerald-400 text-sm">
                          {formatPrice(book.priceKES)}
                        </span>
                        <div className="flex items-center text-xs text-blue-400 group-hover:translate-x-1 transition-transform gap-0.5 justify-end mt-1">
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-slate-200">No books found</h4>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    We couldn't find any titles matching "{query}". Try checking for typos or searching by category.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      onClick={handleClearRecent}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleTagClick(s)}
                        className="px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        <Search className="w-3 h-3 text-slate-500" />
                        <span>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>Popular Trending Topics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Category Jump */}
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Browse by Category</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Self Development', 'Business', 'Psychology', 'Finance', 'Entrepreneurship'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        onClose();
                      }}
                      className="text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-xs font-medium text-slate-300 hover:text-white"
                    >
                      <div className="font-semibold">{cat}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">KES 100 Instant PDF</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Search standard: Find any book within 3 clicks</span>
          <span className="text-emerald-400 font-medium">All eBooks KES 100</span>
        </div>
      </div>
    </div>
  );
};
