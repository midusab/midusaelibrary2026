import React, { useState, useMemo } from 'react';
import { Book, BookCategory } from '../types';
import { CATEGORIES } from '../data/booksData';
import { BookCover } from './BookCover';
import { formatPrice } from '../utils/helpers';
import { 
  Search, 
  Star, 
  ShoppingCart, 
  BookOpen, 
  Heart, 
  Check, 
  X,
  Sparkles,
  Zap,
  Eye,
  SlidersHorizontal,
  Flame,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeaturedBooksProps {
  books: Book[];
  selectedCategory: BookCategory | 'All';
  onSelectCategory: (cat: BookCategory | 'All') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPreviewBook: (book: Book) => void;
  onBuyNow: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
  wishlistIds: string[];
}

export const FeaturedBooks: React.FC<FeaturedBooksProps> = ({
  books,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onPreviewBook,
  onBuyNow,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [addedBookId, setAddedBookId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'newest'>('rating');

  // Filter & Sort computation
  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      // Category match
      if (selectedCategory !== 'All' && book.category !== selectedCategory) {
        return false;
      }
      // Search query match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(q);
        const matchAuthor = book.author.toLowerCase().includes(q);
        const matchCategory = book.category.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchCategory) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.editionYear || b.publicationYear || 0) - (a.editionYear || a.publicationYear || 0));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [books, selectedCategory, searchQuery, sortBy]);

  const handleAddToCartWithFeedback = (book: Book) => {
    onAddToCart(book);
    setAddedBookId(book.id);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#00F2FE', '#1E90FF', '#10B981'],
    });
    setTimeout(() => setAddedBookId(null), 1400);
  };

  return (
    <section id="catalog" className="py-12 sm:py-16 relative bg-[#0B0F19] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Digital Library</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Featured eBook Collection
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-body">
              All uncompressed 300 DPI PDF editions • Fixed KES 100 per title
            </p>
          </div>

          {/* Quick Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  sortBy === 'rating' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-3 h-3" />
                <span>Top Rated</span>
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  sortBy === 'popular' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Best Sellers</span>
              </button>
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  sortBy === 'newest' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>2026 Releases</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 space-y-3.5 shadow-lg">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, or category keyword..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm sm:text-base font-body text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm">
            <button
              onClick={() => onSelectCategory('All')}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              All Genres ({books.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Book Grid */}
        {filteredBooks.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-slate-900/60 border border-slate-800 p-8 space-y-3">
            <Search className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-xl font-bold font-heading text-white">No eBooks matched your filter</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              We couldn't find any books matching "{searchQuery}". Try searching by another keyword.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('All');
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const isWishlisted = wishlistIds.includes(book.id);
              const isJustAdded = addedBookId === book.id;

              return (
                <div
                  key={book.id}
                  className="group rounded-3xl bg-[#0F172A] border border-slate-800/80 hover:border-blue-500/50 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Cover Display Area */}
                  <div className="relative p-5 pb-3 flex items-center justify-center bg-slate-950/60">
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => onToggleWishlist(book)}
                      className={`absolute top-3 right-3 z-10 p-2.5 rounded-full border transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    </button>

                    {/* PDF Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-blue-400 font-mono text-[10px] font-bold">
                        PDF
                      </span>
                    </div>

                    {/* Book Cover */}
                    <div 
                      onClick={() => onPreviewBook(book)}
                      className="cursor-pointer transition-transform duration-300 group-hover:scale-103 py-2"
                    >
                      <BookCover book={book} size="md" />
                    </div>
                  </div>

                  {/* Book Card Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Rating & Category */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-wider">
                          {book.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold text-white text-xs">{book.rating}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({book.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 
                        onClick={() => onPreviewBook(book)}
                        className="font-heading font-bold text-base sm:text-lg text-slate-100 group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                      >
                        {book.title}
                      </h3>

                      {/* Subtitle / Author */}
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-body">
                        {book.subtitle}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        By {book.author}
                      </p>
                    </div>

                    {/* Price & Primary Actions */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                      
                      {/* Price row */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-lg font-heading font-extrabold text-emerald-400">
                            {formatPrice(book.priceKES)}
                          </span>
                          <span className="text-xs text-slate-500 line-through ml-2 font-body">
                            {formatPrice(book.originalPriceKES)}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {book.fileSize}
                        </span>
                      </div>

                      {/* Main Buy Now Button */}
                      <button
                        onClick={() => onBuyNow(book)}
                        className="w-full py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-white text-white" />
                        <span>Buy Now</span>
                      </button>

                      {/* Secondary action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddToCartWithFeedback(book)}
                          className={`w-full py-2 px-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onPreviewBook(book)}
                          className="w-full py-2 px-2.5 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
