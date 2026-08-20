import React from 'react';
import { TESTIMONIALS } from '../data/booksData';
import { Star, Quote, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-14 sm:py-20 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs sm:text-sm font-subheading font-semibold text-blue-700 mb-3">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Trusted By 5,000+ Readers</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-slate-900 tracking-tight">
            What Our Readers Say
          </h2>
          <p className="text-base sm:text-lg font-subheading font-semibold text-slate-600 mt-2.5 max-w-xl mx-auto">
            From university campuses to high-growth tech startups, discover how MidusaElibrary empowers minds.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 sm:p-8 rounded-2xl bg-slate-50/60 border border-slate-200/90 relative flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                {/* Rating & Quote mark */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 fill-amber-500" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-blue-200" />
                </div>

                {/* Testimonial text */}
                <p className="text-base sm:text-lg font-body font-normal text-slate-700 leading-relaxed italic">
                  "{t.content}"
                </p>

                {/* Book Reference Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-blue-700 font-subheading font-semibold shadow-xs">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Purchased: {t.bookTitle}</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3.5 pt-5 mt-5 border-t border-slate-200">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-blue-300"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900">{t.name}</h4>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" title="Verified Reader" />
                  </div>
                  <p className="text-xs sm:text-sm font-body font-normal text-slate-500">
                    {t.role} • <span className="text-slate-700 font-subheading font-semibold">{t.company}</span>
                  </p>
                </div>
                <span className="ml-auto text-xs text-slate-400 font-body font-normal hidden sm:inline">
                  {t.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
