import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { formatPrice } from '../utils/helpers';
import { BookCover } from './BookCover';
import { 
  X, 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  Check,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistBooks: Book[];
  onRemoveWishlist: (bookId: string) => void;
  onAddToCart: (book: Book) => void;
  onBuyNow?: (book: Book) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistBooks,
  onRemoveWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  const [movedBookId, setMovedBookId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMoveToCart = (book: Book) => {
    onAddToCart(book);
    setMovedBookId(book.id);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#00F2FE', '#1E90FF', '#EC4899'],
    });
    setTimeout(() => {
      onRemoveWishlist(book.id);
      setMovedBookId(null);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans text-slate-800">
      <div 
        className="absolute inset-0 bg-slate-50/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col h-full z-50 animate-slideLeft">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-100/90">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                <Heart className="w-5 h-5 fill-pink-500/20" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-slate-900 text-base sm:text-lg">
                  Saved Wishlist
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {wishlistBooks.length} {wishlistBooks.length === 1 ? 'eBook' : 'eBooks'} Saved
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {wishlistBooks.length === 0 ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-200/80 text-pink-400/60 flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-heading font-bold text-slate-900">
                  Your wishlist is empty
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs mt-1">
                  Click the heart icon on any eBook in our catalog to bookmark it for later reading.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-dodgerblue hover:bg-dodgerblue text-white shadow-md shadow-dodgerblue/20 cursor-pointer transition-transform active:scale-95"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {wishlistBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200 shadow-sm flex items-center gap-3.5"
                >
                  <div className="shrink-0 w-12 h-16 rounded-md overflow-hidden">
                    <BookCover book={book} size="xs" showBadge={false} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-dodgerblue bg-dodgerblue/10 px-2 py-0.5 rounded uppercase font-mono">
                      {book.category}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 truncate mt-1">
                      {book.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      By {book.author}
                    </p>
                    
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-extrabold text-sm text-dodgerblue">
                        {formatPrice(book.priceKES)}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        {formatPrice(book.originalPriceKES)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleMoveToCart(book)}
                      className="p-2 rounded-xl bg-dodgerblue hover:bg-dodgerblue text-white shadow-xs transition-colors cursor-pointer"
                      title="Move to Cart"
                    >
                      {movedBookId === book.id ? (
                        <Check className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => onRemoveWishlist(book.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
