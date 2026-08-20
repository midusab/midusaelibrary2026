import React, { useState } from 'react';
import { UserProfile, Book, PurchasedBook, OrderTransaction } from '../types';
import { formatPrice, generateWhatsAppUrl } from '../utils/helpers';
import { BookCover } from './BookCover';
import { 
  ArrowLeft, 
  User, 
  LogOut, 
  Download, 
  Heart, 
  BookOpen, 
  ShoppingBag, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Sparkles, 
  ExternalLink, 
  Receipt, 
  ShoppingCart, 
  Trash2,
  Copy,
  Check,
  Smartphone,
  Search,
  Lock,
  Eye,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserProfilePageProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onBack: () => void;
  books: Book[];
  purchasedBooks: PurchasedBook[];
  orderTransactions: OrderTransaction[];
  wishlistBooks: Book[];
  onRemoveWishlist: (bookId: string) => void;
  onAddToCart: (book: Book) => void;
  onSelectBook: (book: Book) => void;
  onBuyNow: (book: Book) => void;
  onReadOnline?: (book: Book) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onBack,
  books,
  purchasedBooks,
  orderTransactions,
  wishlistBooks,
  onRemoveWishlist,
  onAddToCart,
  onSelectBook,
  onBuyNow,
  onReadOnline,
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'wishlist' | 'orders'>('library');
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | 'mpesa' | null>(null);
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [phoneLookup, setPhoneLookup] = useState('');

  // 1-Click Google Login
  const handleGoogleSignIn = () => {
    setLoadingProvider('google');
    setTimeout(() => {
      const profile: UserProfile = {
        id: `google-${Date.now()}`,
        name: 'Alex Kariuki',
        email: 'alex.kariuki@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        provider: 'google',
      };
      onLogin(profile);
      setLoadingProvider(null);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
      });
    }, 350);
  };

  // 1-Click Facebook Login
  const handleFacebookSignIn = () => {
    setLoadingProvider('facebook');
    setTimeout(() => {
      const profile: UserProfile = {
        id: `fb-${Date.now()}`,
        name: 'Sarah Mwangi',
        email: 'sarah.mwangi@facebook.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        provider: 'facebook',
      };
      onLogin(profile);
      setLoadingProvider(null);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1877F2', '#42B72A', '#00F2FE'],
      });
    }, 350);
  };

  // Quick M-Pesa Phone Sign-in / Lookup
  const handleMpesaSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneLookup.trim()) return;
    setLoadingProvider('mpesa');

    setTimeout(() => {
      const cleanPhone = phoneLookup.trim();
      const profile: UserProfile = {
        id: `mpesa-${cleanPhone}`,
        name: `M-Pesa (${cleanPhone})`,
        email: `${cleanPhone}@mpesa.midusa.co.ke`,
        phone: cleanPhone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        provider: 'mpesa',
      };
      onLogin(profile);
      setLoadingProvider(null);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399'],
      });
    }, 400);
  };

  // PDF Download simulation
  const handleDownloadPDF = (purchasedItem: PurchasedBook) => {
    setDownloadingBookId(purchasedItem.id);
    setTimeout(() => {
      setDownloadingBookId(null);
      const element = document.createElement('a');
      const file = new Blob([
        `%PDF-1.4\n1 0 obj\n<< /Title (${purchasedItem.book.title}) /Author (${purchasedItem.book.author}) >>\nendobj\n`
      ], { type: 'application/pdf' });
      element.href = URL.createObjectURL(file);
      element.download = `${purchasedItem.book.title.replace(/\s+/g, '_')}_Midusa_eBook.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  const handleCopyLink = (item: PurchasedBook) => {
    navigator.clipboard.writeText(item.downloadUrl);
    setCopiedLinkId(item.id);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#0B0F19] text-slate-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between py-4 mb-6 border-b border-slate-800">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 shadow-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Back to Store</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Account Profile & Library</span>
          </div>
        </div>

        {/* If user is logged in: Show full account dashboard */}
        {currentUser ? (
          <div className="space-y-6">
            
            {/* User Profile Header Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-blue-500/30 border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold text-white tracking-tight">
                      {currentUser.name}
                    </h1>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      Verified Reader
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {currentUser.email}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="font-semibold text-blue-400">
                      {purchasedBooks.length} Purchased {purchasedBooks.length === 1 ? 'eBook' : 'eBooks'}
                    </span>
                    <span>•</span>
                    <span>{wishlistBooks.length} in Wishlist</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onLogout}
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 flex items-center justify-center gap-2 transition-colors w-full sm:w-auto cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab('library')}
                className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'library'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className="w-4.5 h-4.5" />
                <span>My eBooks & Links ({purchasedBooks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Heart className="w-4.5 h-4.5" />
                <span>Wishlist ({wishlistBooks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Receipt className="w-4.5 h-4.5" />
                <span>Order History ({orderTransactions.length})</span>
              </button>
            </div>

            {/* Tab 1: My eBooks Library */}
            {activeTab === 'library' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white">
                    Your Purchased eBooks
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Each eBook includes your verified M-Pesa receipt, in-browser reader, and secure unique download link.
                  </p>
                </div>

                {purchasedBooks.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] border border-slate-800 text-center space-y-4 shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-heading font-extrabold text-white text-lg">No Purchased eBooks Yet</h3>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                        When you buy an eBook with M-Pesa, your unique download link is instantly saved right here in your account profile.
                      </p>
                    </div>
                    <button
                      onClick={onBack}
                      className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-transform active:scale-95 cursor-pointer"
                    >
                      Browse Bookstore Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {purchasedBooks.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 sm:p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-slate-700 transition-colors"
                      >
                        {/* Left: Cover & Info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div 
                            onClick={() => onSelectBook(item.book)}
                            className="cursor-pointer shrink-0 w-16 h-22 rounded-md overflow-hidden"
                          >
                            <BookCover book={item.book} size="sm" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20 font-mono">
                                {item.book.category}
                              </span>
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                                Receipt: {item.mpesaReceiptNumber}
                              </span>
                            </div>

                            <h3 
                              onClick={() => onSelectBook(item.book)}
                              className="font-heading font-bold text-base sm:text-lg text-white truncate hover:text-blue-400 cursor-pointer pt-0.5"
                            >
                              {item.book.title}
                            </h3>
                            <p className="text-xs text-slate-400 truncate">
                              By {item.book.author} • {item.book.fileSize} • High-Res PDF
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              Purchased: {item.purchaseDate} {item.phoneNumber ? `• Phone: ${item.phoneNumber}` : ''}
                            </p>

                            {/* Unique Download Link Bar */}
                            <div className="pt-2">
                              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 max-w-lg">
                                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold shrink-0">
                                  Unique Link:
                                </span>
                                <input
                                  type="text"
                                  readOnly
                                  value={item.downloadUrl}
                                  className="text-xs font-mono text-slate-300 bg-transparent outline-none truncate w-full"
                                />
                                <button
                                  onClick={() => handleCopyLink(item)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition-colors cursor-pointer"
                                  title="Copy unique download link"
                                >
                                  {copiedLinkId === item.id ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                          {onReadOnline && (
                            <button
                              onClick={() => onReadOnline(item.book)}
                              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-transform active:scale-98 cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>Read In-Browser</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDownloadPDF(item)}
                            disabled={downloadingBookId === item.id}
                            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                          >
                            {downloadingBookId === item.id ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Downloading PDF...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span>Download PDF</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onSelectBook(item.book)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 border border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>Book Overview</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Saved Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white">
                      Saved Wishlist
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Books you've bookmarked to read or purchase next.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 font-bold text-xs border border-pink-500/20 font-mono">
                    {wishlistBooks.length} {wishlistBooks.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {wishlistBooks.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] border border-slate-800 text-center space-y-4 shadow-xl">
                    <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto border border-pink-500/20">
                      <Heart className="w-8 h-8 fill-pink-500/20" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-extrabold text-white text-base">Your Wishlist is Empty</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Click the heart icon on any eBook in the catalog to save titles you want to read later.
                      </p>
                    </div>
                    <button
                      onClick={onBack}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-transform active:scale-95 cursor-pointer"
                    >
                      Browse Books
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistBooks.map((book) => (
                      <div
                        key={book.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            onClick={() => onSelectBook(book)}
                            className="cursor-pointer shrink-0 w-14 h-20 rounded-md overflow-hidden"
                          >
                            <BookCover book={book} size="xs" showBadge={false} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase font-mono">
                              {book.category}
                            </span>
                            <h4 
                              onClick={() => onSelectBook(book)}
                              className="font-heading font-bold text-sm text-white truncate mt-1 hover:text-blue-400 cursor-pointer"
                            >
                              {book.title}
                            </h4>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              By {book.author}
                            </p>
                            
                            <div className="flex items-baseline gap-2 mt-2">
                              <span className="text-sm font-extrabold text-emerald-400">
                                {formatPrice(book.priceKES)}
                              </span>
                              <span className="text-xs text-slate-500 line-through">
                                {formatPrice(book.originalPriceKES)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
                          <button
                            onClick={() => onBuyNow(book)}
                            className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            <span>Buy Now</span>
                          </button>

                          <button
                            onClick={() => onRemoveWishlist(book.id)}
                            className="py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Order History */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base sm:text-lg font-heading font-bold text-white">
                    Order Invoices & Receipts
                  </h2>
                  <p className="text-xs text-slate-400">
                    Verified Kenyan Shillings M-Pesa Transactions
                  </p>
                </div>

                {orderTransactions.length === 0 ? (
                  <div className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] border border-slate-800 text-center space-y-3 shadow-xl">
                    <Receipt className="w-10 h-10 text-slate-500 mx-auto" />
                    <h3 className="font-heading font-extrabold text-white text-base">No Order Receipts Yet</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      All your M-Pesa payments and PDF orders will be documented here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderTransactions.map((order) => (
                      <div 
                        key={order.orderId}
                        className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-white">
                              ORDER #{order.orderId}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] font-mono">
                              PAID • {order.mpesaReceiptNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            {order.items.map((i) => i.bookTitle).join(', ')}
                          </p>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Date: {order.date} • Phone: {order.phoneNumber}
                          </span>
                        </div>

                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                          <span className="font-extrabold text-sm text-emerald-400">
                            {formatPrice(order.amountKES)}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-medium">
                            Unique Link Dispatched
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          /* If user is NOT logged in: Show clean Sign In / M-Pesa lookup screen */
          <div className="max-w-md mx-auto py-6">
            <div className="p-8 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-2xl text-center space-y-6">
              
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                  <User className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight">
                  Sign In to Midusa
                </h1>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Access your purchased eBooks, manage your wishlist, and retrieve your unique download links anytime.
                </p>
              </div>

              {/* M-Pesa Phone Quick Access */}
              <form onSubmit={handleMpesaSignIn} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left space-y-2.5">
                <label className="block text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Quick Access via M-Pesa Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 0712 345 678"
                    value={phoneLookup}
                    onChange={(e) => setPhoneLookup(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="mt-2 w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    View My Purchased eBooks
                  </button>
                </div>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-medium">Or continue with</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={!!loadingProvider}
                  className="w-full py-3 px-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 font-bold text-xs sm:text-sm text-slate-200 shadow-sm flex items-center justify-center gap-3 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {loadingProvider === 'google' ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={!!loadingProvider}
                  className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] font-bold text-xs sm:text-sm text-white shadow-sm flex items-center justify-center gap-3 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {loadingProvider === 'facebook' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  <span>Continue with Facebook</span>
                </button>
              </div>

              <button
                onClick={onBack}
                className="text-xs text-slate-500 hover:text-slate-300 font-semibold cursor-pointer"
              >
                ← Return to Bookstore
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
