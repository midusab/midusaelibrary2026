import React, { useState } from 'react';
import { Book } from '../types';
import { BookCover } from './BookCover';
import { formatPrice } from '../utils/helpers';
import { 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface HeroProps {
  featuredBooks: Book[];
  onBrowseBooks: () => void;
  onPreviewBook: (book: Book) => void;
  onBuyNow: (book: Book) => void;
}

export const Hero: React.FC<HeroProps> = ({
  featuredBooks,
  onBrowseBooks,
  onPreviewBook,
  onBuyNow,
}) => {
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const activeBook = featuredBooks[activeHeroIdx] || featuredBooks[0];

  return (
    <section id="hero" className="relative pt-24 pb-14 sm:pt-32 sm:pb-20 overflow-hidden bg-white text-slate-800 font-sans">
      {/* Background Soft Ambient DodgerBlue Glow */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[550px] sm:w-[850px] h-[380px] bg-dodgerblue/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs sm:text-sm text-slate-700 shadow-md">
              <Sparkles className="w-4 h-4 text-dodgerblue animate-pulse" />
              <span className="font-semibold text-slate-700">Curated Digital Library • Standard 300 DPI PDF Editions</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Transformational Books for{' '}
              <span className="text-dodgerblue">
                Ambitious Minds
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 font-body max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore handpicked titles across <span className="font-semibold text-slate-700">Self Development</span>, <span className="font-semibold text-slate-700">Business</span>, <span className="font-semibold text-slate-700">Psychology</span>, <span className="font-semibold text-slate-700">Finance</span>, and <span className="font-semibold text-slate-700">Entrepreneurship</span>. Flat KES 100 with instant M-Pesa STK push download.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onBrowseBooks}
                className="px-6 py-3.5 rounded-xl font-heading font-bold text-sm sm:text-base bg-dodgerblue hover:bg-dodgerblue text-white shadow-lg shadow-dodgerblue/20 flex items-center gap-2.5 transition-transform active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-slate-900" />
                <span>Browse Catalog</span>
                <ArrowRight className="w-5 h-5 text-slate-900" />
              </button>

              <button
                onClick={() => onBuyNow(activeBook)}
                className="px-6 py-3.5 rounded-xl font-heading font-bold text-sm sm:text-base bg-dodgerblue hover:bg-dodgerblue text-white shadow-lg shadow-dodgerblue/20 flex items-center gap-2.5 transition-transform active:scale-95 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Simple Trust Features */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-3 text-xs sm:text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-dodgerblue" />
                <span>Instant M-Pesa STK Push</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-dodgerblue" />
                <span>Permanent Library Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Zero Subscriptions</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive Floating Book Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            <div className="relative py-4">
              
              {/* Secondary background book peek */}
              {featuredBooks[1] && (
                <div 
                  onClick={() => setActiveHeroIdx(1)}
                  className="absolute top-2 -right-6 opacity-40 scale-90 rotate-6 cursor-pointer hover:opacity-70 transition-all hidden sm:block z-0"
                >
                  <BookCover book={featuredBooks[1]} size="md" showBadge={false} />
                </div>
              )}

              {/* Main Featured 3D Book */}
              <div 
                className="relative z-10 cursor-pointer group"
                onClick={() => onPreviewBook(activeBook)}
              >
                <div className="p-4 rounded-3xl bg-slate-100/60 border border-slate-200 shadow-2xl backdrop-blur-xs">
                  <BookCover book={activeBook} size="hero" />
                </div>

                {/* Floating Glassmorphic Badge Over Book */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-11/12 p-3.5 rounded-2xl bg-slate-50/95 border border-slate-300/80 shadow-2xl backdrop-blur-md flex items-center justify-between z-20">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-dodgerblue font-mono">
                      Featured 2026 Edition
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {activeBook.title}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-extrabold text-dodgerblue">
                      {formatPrice(activeBook.priceKES)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Category Selector Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 z-10">
              {featuredBooks.slice(0, 5).map((book, idx) => (
                <button
                  key={book.id}
                  onClick={() => setActiveHeroIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeHeroIdx === idx
                      ? 'bg-dodgerblue text-white shadow-md shadow-dodgerblue/20 border border-dodgerblue'
                      : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {book.category}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
