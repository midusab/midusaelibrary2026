import React, { useState } from 'react';
import { generateWhatsAppUrl } from '../utils/helpers';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

interface FloatingWhatsAppProps {
  currentBookTitle?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  currentBookTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(
    currentBookTitle
      ? `Hello Midusa Support, I would like to order: "${currentBookTitle}".`
      : 'Hello Midusa Support, I would like to order an eBook via M-Pesa.'
  );

  const handleSend = () => {
    const url = generateWhatsAppUrl(undefined, customMsg);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end font-sans">
      {/* Expanded Quick Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-[#0F172A] animate-scaleIn text-slate-100">
          {/* Header */}
          <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-300 border-2 border-emerald-600 animate-pulse" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base">Midusa Support Desk</h4>
                <p className="text-[11px] text-emerald-100">
                  Online • Instant M-Pesa PDF Delivery
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body Bubble */}
          <div className="p-4 space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900/90 text-slate-300 border border-slate-800 leading-relaxed">
              <p className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Habari! Need any eBook? 📚
              </p>
              Send us a message here or directly on WhatsApp for instant assistance with orders, download links, or custom book requests.
            </div>

            <div className="space-y-2">
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your message..."
                rows={2}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-sans"
              />

              <button
                onClick={handleSend}
                className="w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-transform active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Chat on WhatsApp (+254 756 816 718)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Contact on WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border border-emerald-600 animate-ping" />
        </div>
        <span className="font-heading font-bold text-xs sm:text-sm hidden sm:inline">
          WhatsApp Desk
        </span>
      </button>
    </div>
  );
};
