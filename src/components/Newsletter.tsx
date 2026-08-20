import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubscribed(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00F2FE', '#1E90FF', '#10B981'],
    });
  };

  return (
    <section className="py-12 sm:py-16 relative bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Box */}
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold tracking-tight">
            Stay Updated on New Releases
          </h2>

          <p className="text-sm sm:text-base font-subheading font-semibold text-blue-100 max-w-md mx-auto leading-relaxed">
            Get notified when new bestsellers in Business, Finance, and Psychology drop in our catalog.
          </p>

          {subscribed ? (
            <div className="p-4 rounded-2xl bg-white/15 border border-white/20 max-w-sm mx-auto animate-scaleIn space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-300 font-heading font-bold text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>Subscribed Successfully</span>
              </div>
              <p className="text-xs font-body font-normal text-blue-100">
                You will receive alerts when new bestsellers are added to the library.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
              <div className="relative flex-1">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm font-body font-normal text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-body font-medium text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-xs font-body font-normal text-blue-200">
            No spam • Unsubscribe anytime with 1 click
          </p>
        </div>

      </div>
    </section>
  );
};
