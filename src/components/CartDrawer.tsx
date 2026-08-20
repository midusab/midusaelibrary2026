import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { formatPrice, generateCartWhatsAppUrl } from '../utils/helpers';
import { BookCover } from './BookCover';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  Lock,
  Download,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onClearCart: () => void;
  onCheckoutWithMpesa: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutWithMpesa,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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

  const totalKES = items.reduce(
    (sum, item) => sum + item.book.priceKES * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#0F172A] border-l border-slate-800 shadow-2xl flex flex-col h-full z-50 animate-slideLeft text-slate-100">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-white text-base sm:text-lg">
                  Your Digital Cart
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {items.reduce((acc, item) => acc + item.quantity, 0)} Items Selected
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          {items.length === 0 ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 text-slate-500 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-heading font-bold text-white">
                  Your cart is empty
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xs mt-1 font-body">
                  Add handpicked eBooks in Business, Psychology, Finance, and Self-Discipline for only KES 100 each.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 cursor-pointer transition-transform active:scale-95"
              >
                Browse Books Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                
                {/* Clear Cart Confirmation Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs text-slate-400 font-medium">
                  <span>Selected Books</span>
                  {showClearConfirm ? (
                    <div className="flex items-center gap-2">
                      <span className="text-rose-400 font-bold text-xs">Clear all?</span>
                      <button
                        onClick={() => {
                          onClearCart();
                          setShowClearConfirm(false);
                        }}
                        className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Empty Cart</span>
                    </button>
                  )}
                </div>

                {items.map((item) => (
                  <div
                    key={item.book.id}
                    className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm flex items-center gap-3.5"
                  >
                    {/* Thumbnail Cover */}
                    <div className="shrink-0 flex items-center justify-center w-12 h-16 rounded-md overflow-hidden">
                      <BookCover book={item.book} size="xs" showBadge={false} />
                    </div>

                    {/* Book Information */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                        {item.book.category}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-slate-100 truncate mt-1">
                        {item.book.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        By {item.book.author}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="font-extrabold text-sm text-emerald-400">
                          {formatPrice(item.book.priceKES)}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          PDF • {item.book.fileSize}
                        </span>
                      </div>
                    </div>

                    {/* Remove item button */}
                    <button
                      onClick={() => onRemoveItem(item.book.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                      title="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout Calculation & Actions */}
              <div className="p-4 sm:p-5 bg-slate-900/95 border-t border-slate-800 space-y-3.5">
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery Method</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Instant STK Download Link</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-bold text-white pt-2 border-t border-slate-800">
                    <span>Total</span>
                    <span className="text-emerald-400 font-extrabold">{formatPrice(totalKES)}</span>
                  </div>
                </div>

                {/* Instant M-Pesa STK Push Checkout Button */}
                <button
                  onClick={() => {
                    onClose();
                    onCheckoutWithMpesa();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transition-all active:scale-98 cursor-pointer"
                >
                  <Zap className="w-4.5 h-4.5 fill-white" />
                  <span>Checkout {formatPrice(totalKES)} via M-Pesa</span>
                  <ArrowRight className="w-4.5 h-4.5 ml-auto" />
                </button>

                {/* Direct WhatsApp Instant Buy Button */}
                <a
                  href={generateCartWhatsAppUrl(items, totalKES)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Order via WhatsApp Desk</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
