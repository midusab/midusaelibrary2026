import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  HeartHandshake, 
  Clock, 
  Smartphone
} from 'lucide-react';

interface AboutPageProps {
  onBrowseCatalog: () => void;
  onContactClick: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBrowseCatalog,
  onContactClick
}) => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header / Mission Statement */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Origin & Purpose</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Democratizing Transformational Knowledge for Every Kenyan Reader
          </h1>

          <p className="text-base sm:text-lg text-slate-400 font-body max-w-2xl mx-auto leading-relaxed">
            MidusaElibrary was built on a simple conviction: the world's most actionable books in business, psychology, finance, and discipline should be instantly accessible to ambitious minds without high financial barriers.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Universal KES 100 Price</h3>
            <p className="text-sm text-slate-400 font-body leading-relaxed">
              No complex subscriptions, no hidden recurrent charges. Every single book in our verified catalog is flat 100 Kenyan Shillings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">Instant M-Pesa STK Push</h3>
            <p className="text-sm text-slate-400 font-body leading-relaxed">
              Pay via Safaricom M-Pesa in under 15 seconds. High-resolution PDF download links and account access are unlocked instantaneously.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white">High-Resolution PDF Standard</h3>
            <p className="text-sm text-slate-400 font-body leading-relaxed">
              Unabridged editions formatted perfectly for Apple Books, Kindle, Moon+ Reader, Android tablets, and desktop workstations.
            </p>
          </div>
        </div>

        {/* The Midusa Standard */}
        <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <h2 className="font-heading font-bold text-2xl text-white">
              The Midusa Curation Standard
            </h2>
          </div>

          <p className="text-slate-300 font-body leading-relaxed">
            We do not flood our digital shelves with low-quality fluff. Every title added to MidusaElibrary undergoes rigorous editorial review for:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">Actionable Takeaways</strong>
                <span className="text-xs text-slate-400">Frameworks and playbooks you can execute immediately in business and life.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">Clean Typographic Layout</strong>
                <span className="text-xs text-slate-400">Zero scan artifacts, high-contrast serif/sans typography, and clean margins.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">Lifetime Re-download Access</strong>
                <span className="text-xs text-slate-400">Your purchases are permanently linked to your phone number and account library.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block">24/7 Human Support</strong>
                <span className="text-xs text-slate-400">Direct WhatsApp and email assistance for any payment or download query.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer Block */}
        <div className="text-center space-y-6 pt-6">
          <h3 className="font-heading font-bold text-2xl text-white">Ready to explore the library?</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onBrowseCatalog}
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>Browse All Books</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onContactClick}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm sm:text-base border border-slate-700 transition-colors cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
