import React, { useState, useEffect } from 'react';
import { Book, BookReview, TableOfContentItem } from '../types';
import { formatPrice, generateWhatsAppUrl, getBookTableOfContents, getBookReviews } from '../utils/helpers';
import { BookCover } from './BookCover';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Check, 
  MessageSquare, 
  Star, 
  FileText, 
  CheckCircle2, 
  BookOpen,
  Calendar,
  Layers,
  Globe,
  Zap,
  Smartphone,
  ShieldCheck,
  User,
  Plus,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookDetailPageProps {
  book: Book;
  allBooks: Book[];
  onBack: () => void;
  onSelectBook: (book: Book) => void;
  onBuyNow: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
  onOpenReader: (book: Book) => void;
  wishlistIds: string[];
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  book,
  allBooks,
  onBack,
  onSelectBook,
  onBuyNow,
  onAddToCart,
  onToggleWishlist,
  onOpenReader,
  wishlistIds,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'toc' | 'author' | 'reviews'>('overview');

  // Reviews state with local storage support
  const initialReviews = getBookReviews(book);
  const [reviews, setReviews] = useState<BookReview[]>(initialReviews);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const tableOfContents: TableOfContentItem[] = getBookTableOfContents(book);

  // Scroll to top when book changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setReviews(getBookReviews(book));
  }, [book.id]);

  const isWishlisted = wishlistIds.includes(book.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToCartClick = () => {
    onAddToCart(book);
    setIsAdded(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00F2FE', '#1E90FF', '#10B981'],
    });
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName || !newReviewComment) return;

    const newRev: BookReview = {
      id: `rev-${Date.now()}`,
      bookId: book.id,
      userName: newReviewerName,
      rating: newRating,
      date: 'Just now',
      title: newReviewTitle || 'Verified Reader Review',
      comment: newReviewComment,
      verifiedPurchase: true,
    };

    setReviews([newRev, ...reviews]);
    setIsReviewFormOpen(false);
    setNewReviewerName('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  // Find related books in the same category (excluding current book)
  const relatedBooks = allBooks
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  return (
    <div className="pt-20 pb-20 min-h-screen bg-[#0B0F19] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between py-4 mb-6 border-b border-slate-800/80">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Books</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleWishlist(book)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer relative"
              title="Share Book"
            >
              <Share2 className="w-4.5 h-4.5" />
              {copiedLink && (
                <span className="absolute -top-8 right-0 px-2 py-1 bg-blue-600 text-[10px] text-white rounded-md shadow-md whitespace-nowrap animate-fadeIn">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 1. ABOVE THE FOLD: Hero Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Left Column: 3D Book Cover Display */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-center shadow-2xl">
              <div className="w-56 sm:w-64">
                <BookCover book={book} size="lg" showBadge={true} />
              </div>
            </div>

            {/* Quick Action: Online Reader Preview button */}
            <div className="w-full max-w-sm mt-4">
              <button
                onClick={() => onOpenReader(book)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-blue-400 hover:text-blue-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Free Online Preview</span>
              </button>
            </div>
          </div>

          {/* Right Column: Book Metas, Pricing & Purchase Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category & Verified Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {book.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Full PDF</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {book.fileSize}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed">
                {book.subtitle}
              </p>
            </div>

            {/* Author & Star Rating */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 pb-4 border-b border-slate-800">
              <div>
                <span className="text-slate-500">By </span>
                <span className="font-semibold text-white">{book.author}</span>
              </div>

              <div className="h-4 w-px bg-slate-800" />

              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="font-bold text-white">{book.rating}</span>
                <span className="text-slate-500">({reviews.length} reviews)</span>
              </div>

              <div className="h-4 w-px bg-slate-800" />

              <div className="text-slate-400 text-xs font-mono">
                {book.pages} Pages • DRM-Free PDF
              </div>
            </div>

            {/* Price & Purchase Actions Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-heading font-extrabold text-emerald-400">
                  {formatPrice(book.priceKES)}
                </span>
                <span className="text-base text-slate-500 line-through font-body">
                  {formatPrice(book.originalPriceKES)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  67% OFF
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Primary Buy Now */}
                <button
                  onClick={() => onBuyNow(book)}
                  className="w-full py-4 px-6 rounded-2xl font-heading font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-transform active:scale-98 cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Buy Now</span>
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCartClick}
                  className="w-full py-4 px-6 rounded-2xl font-heading font-bold text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2.5 transition-transform active:scale-98 cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* M-Pesa Guarantee */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Instant M-Pesa STK Push Download</span>
                </span>
                <span className="text-slate-500">Read on iPhone / Android / Kindle</span>
              </div>
            </div>

          </div>

        </div>

        {/* 2. BELOW THE FOLD: Tabs for Overview, Table of Contents, Author & Reviews */}
        <div className="mt-12 space-y-8">
          
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-800 overflow-x-auto gap-2 sm:gap-4 no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3.5 px-3 text-sm font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-blue-400 border-blue-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Description & Takeaways
            </button>

            <button
              onClick={() => setActiveTab('toc')}
              className={`pb-3.5 px-3 text-sm font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'toc'
                  ? 'text-blue-400 border-blue-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <span>Table of Contents</span>
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-800 text-slate-300">
                {tableOfContents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('author')}
              className={`pb-3.5 px-3 text-sm font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'author'
                  ? 'text-blue-400 border-blue-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              Author Information
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3.5 px-3 text-sm font-heading font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'text-blue-400 border-blue-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <span>Reader Reviews</span>
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {reviews.length}
              </span>
            </button>
          </div>

          {/* TAB 1: Overview & Key Takeaways */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h3 className="font-heading font-bold text-xl text-white">About This Edition</h3>
                  <p className="text-slate-300 font-body text-sm sm:text-base leading-relaxed">
                    {book.description}
                  </p>
                  <p className="text-slate-400 font-body text-sm leading-relaxed">
                    Formatted in pristine high-resolution PDF with clickable internal table of contents, high-contrast serif body typography, and optimized vector diagrams for instant reading on any screen size.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Key Practical Takeaways</span>
                  </div>

                  <ul className="space-y-3">
                    {book.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Table of Contents */}
          {activeTab === 'toc' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">Complete Table of Contents</h3>
                  <p className="text-xs text-slate-400">Total {book.pages} Pages across {tableOfContents.length} structured chapters</p>
                </div>
                <button
                  onClick={() => onOpenReader(book)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Launch Reader</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800">
                {tableOfContents.map((chapter) => (
                  <div key={chapter.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {chapter.chapterNumber}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-sm sm:text-base text-slate-100 truncate">
                          {chapter.title}
                        </h4>
                        <span className="text-xs text-slate-500 font-mono">Pages {chapter.pages}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {chapter.previewAvailable ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Preview Available
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400">
                          Full Edition
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Author Information */}
          {activeTab === 'author' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-2xl font-bold font-heading">
                  {book.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white">{book.author}</h3>
                  <p className="text-xs text-blue-400 font-medium">{book.category} Author & Specialist</p>
                </div>
              </div>

              <p className="text-slate-300 font-body text-sm sm:text-base leading-relaxed">
                {book.authorBio || `${book.author} is an internationally recognized strategist, author, and researcher specializing in ${book.category.toLowerCase()} and high-performance execution. With over a decade of empirical research, their works have been translated into multiple languages and praised by enterprise leaders and operators worldwide.`}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-500">Edition Year</div>
                  <div className="font-bold text-white text-sm mt-1">{book.editionYear || book.publicationYear || 2026}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-500">Global Readership</div>
                  <div className="font-bold text-white text-sm mt-1">45,000+ Readers</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-500">Digital Format</div>
                  <div className="font-bold text-emerald-400 text-sm mt-1">Standard 300 DPI PDF</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">Verified Customer Ratings</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-white">{book.rating} out of 5</span>
                    <span className="text-slate-400 text-xs">({reviews.length} reviews)</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Interactive Leave a Review Form */}
              {isReviewFormOpen && (
                <form onSubmit={handleAddReview} className="p-6 rounded-3xl bg-slate-900/90 border border-blue-500/40 shadow-xl space-y-4 animate-fadeIn">
                  <h4 className="font-heading font-bold text-lg text-white">Share Your Feedback on this eBook</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                        placeholder="e.g. Sarah Kimani"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Rating *</label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-hidden focus:border-blue-500"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                        <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                        <option value={3}>⭐⭐⭐ 3 Stars (Good)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Review Title</label>
                    <input
                      type="text"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g. Life-changing insights on compounding focus"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Review *</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="What was the most valuable concept you learned from this book?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReviewFormOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-white text-xs font-bold flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-heading font-bold text-sm text-white flex items-center gap-2">
                            <span>{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified Buyer</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {[...Array(Math.floor(rev.rating))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <h5 className="font-heading font-semibold text-slate-200 text-sm">{rev.title}</h5>
                    <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* 3. RELATED BOOKS SECTION */}
        {relatedBooks.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  More in {book.category}
                </h3>
                <p className="text-xs text-slate-400">Readers who bought {book.title} also enjoyed these titles</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedBooks.map((relBook) => (
                <div
                  key={relBook.id}
                  onClick={() => onSelectBook(relBook)}
                  className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="w-full aspect-3/4 mb-3 rounded-lg overflow-hidden shadow-sm">
                    <BookCover book={relBook} size="md" showBadge={false} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-100 group-hover:text-blue-400 truncate">
                      {relBook.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">By {relBook.author}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-emerald-400 text-xs">
                        {formatPrice(relBook.priceKES)}
                      </span>
                      <span className="text-[10px] text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                        View &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
