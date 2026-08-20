import React, { useState } from 'react';
import { FAQS } from '../data/booksData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-20 relative bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs sm:text-sm font-subheading font-semibold text-blue-700 mb-3">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg font-subheading font-semibold text-slate-600 mt-2.5">
            Everything you need to know about formats, delivery, device sync, and order support.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-slate-900">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-xl transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600 bg-blue-50' : 'bg-slate-100 text-slate-500'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base font-body font-normal text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
