import React from 'react';
import { BookCategory } from '../types';
import { CATEGORIES } from '../data/booksData';
import { generateWhatsAppUrl } from '../utils/helpers';
import { 
  BookOpen, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Smartphone,
  CheckCircle2,
  Heart
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: BookCategory) => void;
  onNavigateHome: () => void;
  onNavigateBestSellers: () => void;
  onNavigateNewArrivals: () => void;
  onNavigateAbout: () => void;
  onNavigateContact: () => void;
  onOpenPolicy: (type: 'refund' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateHome,
  onNavigateBestSellers,
  onNavigateNewArrivals,
  onNavigateAbout,
  onNavigateContact,
  onOpenPolicy,
}) => {
  return (
    <footer className="relative bg-[#080C14] border-t border-slate-800/90 pt-16 pb-12 text-slate-400 text-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand Story & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 cursor-pointer text-left group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-heading font-extrabold tracking-tight text-white">
                  Midusa<span className="text-blue-500">Elibrary</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Kenya's Digital Knowledge Hub
                </span>
              </div>
            </button>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-body">
              Democratizing high-yield business, psychology, and self-mastery books across Kenya. Every title is standardized in high-res PDF format for an effortless flat KES 100 via Safaricom M-Pesa.
            </p>

            {/* Direct WhatsApp Concierge Button */}
            <div className="pt-2">
              <a
                href={generateWhatsAppUrl(undefined, 'Hello Midusa Support, I need help with an eBook.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>24/7 WhatsApp Support Desk</span>
              </a>
            </div>
          </div>

          {/* Col 3: Navigation Standards */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home Store
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateBestSellers}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateNewArrivals}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  New Arrivals (2026)
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateAbout}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About MidusaElibrary
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateContact}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Help Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Book Categories */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Genres & Collections
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.name)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Trust Standards & Legal */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Trust & Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenPolicy('refund')}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-emerald-400"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Refund Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Digital Service
                </button>
              </li>
              <li>
                <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                  <div>Nairobi, Kenya</div>
                  <div>Mon - Sun: 7am - 11pm EAT</div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Trust Badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>© {new Date().getFullYear()} MidusaElibrary. All rights reserved.</span>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Accepted Payments:</span>
            <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono text-[10px]">
              M-PESA
            </div>
            <div className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold font-mono text-[10px]">
              VISA / MASTERCARD
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
