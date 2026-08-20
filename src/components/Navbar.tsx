import React, { useState, useEffect } from 'react';
import { BookCategory, UserProfile } from '../types';
import { CATEGORIES } from '../data/booksData';
import { 
  BookOpen, 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  Flame,
  Clock,
  HelpCircle,
  LogIn,
  Info,
  Mail
} from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenProfile: () => void;
  onOpenAuthModal: () => void;
  onOpenSearchModal: () => void;
  onNavigateHome: () => void;
  onNavigateBestSellers: () => void;
  onNavigateNewArrivals: () => void;
  onNavigateAbout: () => void;
  onNavigateContact: () => void;
  onSelectCategory: (category: BookCategory | 'All') => void;
  selectedCategory: BookCategory | 'All';
  currentUser: UserProfile | null;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenProfile,
  onOpenAuthModal,
  onOpenSearchModal,
  onNavigateHome,
  onNavigateBestSellers,
  onNavigateNewArrivals,
  onNavigateAbout,
  onNavigateContact,
  onSelectCategory,
  selectedCategory,
  currentUser,
  onScrollToSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/90 shadow-lg shadow-black/20'
          : 'bg-[#0B0F19]/75 backdrop-blur-md border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          
          {/* 1. Logo Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1">
                  Midusa<span className="text-blue-500">Elibrary</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 block -mt-1">
                  KES 100 • Instant PDF
                </span>
              </div>
            </button>
          </div>

          {/* 2. Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 font-body text-sm font-medium text-slate-300">
            
            {/* Home */}
            <button
              onClick={onNavigateHome}
              className="px-3 py-2 rounded-lg hover:text-blue-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Home
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                className="px-3 py-2 rounded-lg hover:text-blue-400 hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-slideDown">
                  <button
                    onClick={() => {
                      onSelectCategory('All');
                      setIsCategoryDropdownOpen(false);
                      onScrollToSection('catalog');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>All Genres (15 Titles)</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <div className="my-1 border-t border-slate-800" />
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.name);
                        setIsCategoryDropdownOpen(false);
                        onScrollToSection('catalog');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat.name ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">KES 100</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Best Sellers */}
            <button
              onClick={onNavigateBestSellers}
              className="px-3 py-2 rounded-lg hover:text-blue-400 hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Best Sellers</span>
            </button>

            {/* New Arrivals */}
            <button
              onClick={onNavigateNewArrivals}
              className="px-3 py-2 rounded-lg hover:text-blue-400 hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>New Arrivals</span>
            </button>

            {/* About */}
            <button
              onClick={onNavigateAbout}
              className="px-3 py-2 rounded-lg hover:text-blue-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              About
            </button>

            {/* Contact */}
            <button
              onClick={onNavigateContact}
              className="px-3 py-2 rounded-lg hover:text-blue-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* 3. Search Bar Trigger (Visible & Universal) */}
          <div className="flex-1 max-w-xs sm:max-w-sm mx-2">
            <button
              onClick={onOpenSearchModal}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer shadow-inner"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">Search title, author, category...</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
                /
              </kbd>
            </button>
          </div>

          {/* 4. Right Actions: Wishlist, Cart & Auth/Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors relative cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-scaleUp">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 transition-transform active:scale-95 cursor-pointer"
              title="View Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="w-5 h-5 bg-white/20 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Auth / Profile Button */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors cursor-pointer"
                title="Account & My Library"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg object-cover"
                />
                <span className="hidden md:inline text-xs font-semibold truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0B0F19]/95 backdrop-blur-2xl border-b border-slate-800 p-4 space-y-3 z-50 animate-slideDown shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onNavigateHome();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                onNavigateBestSellers();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => {
                onNavigateNewArrivals();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() => {
                onNavigateAbout();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-purple-400" />
              <span>About Us</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigateContact();
                setIsMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-slate-300 hover:text-blue-400 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </button>

            <button
              onClick={() => {
                onOpenSearchModal();
                setIsMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-blue-400 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Open Search</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
