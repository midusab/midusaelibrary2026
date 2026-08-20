import React from 'react';
import { BookCategory } from '../types';
import { CATEGORIES } from '../data/booksData';
import { 
  Briefcase, 
  TrendingUp, 
  Sparkles, 
  Brain, 
  Rocket, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface CategoriesSectionProps {
  onSelectCategory: (category: BookCategory) => void;
  selectedCategory: BookCategory | 'All';
  onScrollToCatalog: () => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSelectCategory,
  selectedCategory,
  onScrollToCatalog,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Brain':
        return <Brain className="w-5 h-5" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleCategoryClick = (categoryName: BookCategory) => {
    onSelectCategory(categoryName);
    onScrollToCatalog();
  };

  return (
    <section id="categories" className="py-12 sm:py-16 relative bg-[#0B0F19] text-slate-100 border-t border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Domains</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Browse by Knowledge Domain
          </h2>
          <p className="text-sm text-slate-400 font-body">
            Explore focused 300 DPI PDF collections across 5 essential fields.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.name;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={`p-6 rounded-3xl cursor-pointer transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'border-2 border-blue-500 bg-blue-500/10 shadow-xl'
                    : 'bg-[#0F172A] border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="p-3 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ 
                        backgroundColor: `${category.accentColor}18`, 
                        color: category.accentColor 
                      }}
                    >
                      {getCategoryIcon(category.iconName)}
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 uppercase tracking-wider font-mono">
                      KES 100
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-1.5 group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-slate-400 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>Explore {category.name} Books</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
