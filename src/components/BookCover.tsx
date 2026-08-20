import React from 'react';
import { Book } from '../types';
import { BookOpen, Sparkles, Star, Cpu, Code2, Brain, TrendingUp, Briefcase, Rocket, GraduationCap, Target } from 'lucide-react';

interface BookCoverProps {
  book: Book;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  showBadge?: boolean;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const getCategoryIcon = () => {
    switch (book.category) {
      case 'Self Development':
        return <Sparkles className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} text-purple-300`} />;
      case 'Business':
        return <Briefcase className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} text-sky-300`} />;
      case 'Psychology':
        return <Brain className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} text-pink-300`} />;
      case 'Finance':
        return <TrendingUp className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-300`} />;
      case 'Entrepreneurship':
        return <Rocket className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} text-amber-300`} />;
      default:
        return <BookOpen className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} text-blue-300`} />;
    }
  };

  const dimensions = {
    xs: 'w-[75px] h-[110px]',
    sm: 'w-[140px] h-[200px]',
    md: 'w-[200px] h-[290px]',
    lg: 'w-[240px] h-[340px]',
    hero: 'w-[250px] sm:w-[280px] md:w-[320px] h-[360px] sm:h-[400px] md:h-[450px]',
  }[size];

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 select-none group book-spine-effect ${dimensions} ${className}`}
      style={{
        background: `linear-gradient(145deg, ${book.coverGradient.from} 0%, ${book.coverGradient.via || '#111827'} 50%, ${book.coverGradient.to} 100%)`,
        boxShadow: `0 15px 35px -10px rgba(0,0,0,0.8), 0 0 25px -5px ${book.coverGradient.accent}33`,
      }}
    >
      {/* Background Tech Geometric Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(${book.coverGradient.accent} 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Glossy top-left highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/60 pointer-events-none" />

      {/* Decorative Neon Accent Lines */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-2xl opacity-40 rounded-full pointer-events-none"
        style={{ backgroundColor: book.coverGradient.accent }}
      />
      <div 
        className="absolute bottom-0 left-0 w-24 h-24 blur-xl opacity-30 rounded-full pointer-events-none"
        style={{ backgroundColor: book.coverGradient.to }}
      />

      {/* Badge at top right */}
      {showBadge && book.badge && (
        <div className="absolute top-3 right-3 z-10">
          <span 
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg"
            style={{
              backgroundColor: 'rgba(10, 15, 30, 0.85)',
              color: book.coverGradient.accent,
              border: `1px solid ${book.coverGradient.accent}66`,
            }}
          >
            <Sparkles className="w-3 h-3" />
            {book.badge}
          </span>
        </div>
      )}

      {/* Main Cover Content */}
      <div className={`relative z-10 flex flex-col justify-between h-full text-left ${
        size === 'xs' ? 'p-2 pl-2.5' : 'p-4 sm:p-5 pl-6 sm:pl-7'
      }`}>
        {/* Header: Midusa Logo / Category Pill */}
        <div>
          <div className={`flex items-center justify-between gap-1 ${size === 'xs' ? 'mb-1' : 'mb-2'}`}>
            <div className="flex items-center gap-1.5 opacity-90">
              <div className={`rounded-md bg-white/10 backdrop-blur-sm ${size === 'xs' ? 'p-0.5' : 'p-1'}`}>
                {getCategoryIcon()}
              </div>
              <span className={`font-semibold uppercase tracking-wider text-slate-200 ${
                size === 'xs' ? 'text-[9px]' : 'text-xs'
              }`}>
                {book.category}
              </span>
            </div>
          </div>

          <div 
            className={`rounded-full ${size === 'xs' ? 'w-4 h-0.5 mb-1.5' : 'w-8 h-1 mb-3'}`} 
            style={{ backgroundColor: book.coverGradient.accent }} 
          />

          {/* Book Title */}
          <h4 
            className={`font-bold tracking-tight text-white leading-snug drop-shadow-md ${
              size === 'xs' 
                ? 'text-xs line-clamp-2 leading-tight' 
                : size === 'sm' 
                ? 'text-sm sm:text-base line-clamp-3' 
                : size === 'hero' 
                ? 'text-xl sm:text-2xl lg:text-3xl line-clamp-3' 
                : 'text-base sm:text-lg lg:text-xl line-clamp-3'
            }`}
          >
            {book.title}
          </h4>

          {size !== 'sm' && size !== 'xs' && (
            <p className="text-xs sm:text-sm text-slate-200/90 mt-1.5 line-clamp-2 leading-relaxed">
              {book.subtitle}
            </p>
          )}
        </div>

        {/* Footer: Author & Formats */}
        <div className={`border-t border-white/10 mt-auto ${size === 'xs' ? 'pt-1' : 'pt-2.5'}`}>
          <div className="flex items-center justify-between text-xs text-slate-200">
            <div>
              {size !== 'xs' && (
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Author</p>
              )}
              <p className={`font-semibold text-white truncate ${
                size === 'xs' ? 'text-[10px] max-w-[50px]' : 'text-xs sm:text-sm max-w-[120px] sm:max-w-[150px]'
              }`}>
                {book.author}
              </p>
            </div>
            
            <div className={`flex items-center gap-1 text-amber-300 font-semibold bg-black/40 rounded backdrop-blur-sm ${
              size === 'xs' ? 'text-[10px] px-1 py-0.5' : 'text-xs sm:text-sm px-2 py-0.5'
            }`}>
              <Star className={`${size === 'xs' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} fill-amber-400 text-amber-400`} />
              <span>{book.rating}</span>
            </div>
          </div>

          {/* Midusa Edition Watermark */}
          {size !== 'xs' && (
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[10px] text-slate-400 tracking-wider font-mono">
              <span>MIDUSA DIGITAL</span>
              <span>{book.publicationYear} ED.</span>
            </div>
          )}
        </div>
      </div>

      {/* Book Right Edge 3D Page Thickness Visual */}
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
    </div>
  );
};
