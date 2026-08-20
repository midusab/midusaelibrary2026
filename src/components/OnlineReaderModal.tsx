import React, { useState, useEffect, useRef } from 'react';
import { Book, TableOfContentItem, ReaderBookmark, ReaderNote } from '../types';
import { getBookTableOfContents } from '../utils/helpers';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  Type, 
  Sun, 
  Moon, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  List, 
  Highlighter, 
  Sparkles,
  FileText,
  RotateCcw,
  Plus,
  Trash2
} from 'lucide-react';

interface OnlineReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onBuyNow?: (book: Book) => void;
}

type ReaderTheme = 'dark' | 'light' | 'sepia';

export const OnlineReaderModal: React.FC<OnlineReaderModalProps> = ({
  isOpen,
  onClose,
  book,
  onBuyNow
}) => {
  const tableOfContents: TableOfContentItem[] = getBookTableOfContents(book);

  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'toc' | 'bookmarks' | 'notes'>('toc');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [noteInput, setNoteInput] = useState<string>('');

  const contentRef = useRef<HTMLDivElement>(null);

  // Storage key for resume reading
  const storageKey = `midusa_reader_${book.id}`;
  const bookmarksKey = `midusa_bookmarks_${book.id}`;
  const notesKey = `midusa_notes_${book.id}`;

  const [bookmarks, setBookmarks] = useState<ReaderBookmark[]>(() => {
    const saved = localStorage.getItem(bookmarksKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState<ReaderNote[]>(() => {
    const saved = localStorage.getItem(notesKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Resume where left off
  useEffect(() => {
    if (isOpen) {
      const savedPosition = localStorage.getItem(storageKey);
      if (savedPosition) {
        try {
          const parsed = JSON.parse(savedPosition);
          if (typeof parsed.chapterIndex === 'number' && parsed.chapterIndex < tableOfContents.length) {
            setCurrentChapterIndex(parsed.chapterIndex);
          }
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen, book.id]);

  // Persist progress
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(storageKey, JSON.stringify({
        chapterIndex: currentChapterIndex,
        updatedAt: new Date().toISOString()
      }));
    }
  }, [currentChapterIndex, isOpen, storageKey]);

  useEffect(() => {
    localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
  }, [bookmarks, bookmarksKey]);

  useEffect(() => {
    localStorage.setItem(notesKey, JSON.stringify(notes));
  }, [notes, notesKey]);

  // Scroll listener for reading progress calculation
  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    if (scrollHeight <= clientHeight) {
      setReadingProgress(100);
      return;
    }
    const percent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    setReadingProgress(percent);
  };

  const currentChapter = tableOfContents[currentChapterIndex] || tableOfContents[0];

  const isCurrentBookmarked = bookmarks.some(
    (b) => b.chapterId === currentChapter.id
  );

  const toggleBookmark = () => {
    if (isCurrentBookmarked) {
      setBookmarks(bookmarks.filter((b) => b.chapterId !== currentChapter.id));
    } else {
      const newBookmark: ReaderBookmark = {
        id: `bm-${Date.now()}`,
        bookId: book.id,
        chapterId: currentChapter.id,
        pageNumber: currentChapter.chapterNumber,
        title: `Chapter ${currentChapter.chapterNumber}: ${currentChapter.title}`,
        timestamp: new Date().toLocaleDateString(),
      };
      setBookmarks([...bookmarks, newBookmark]);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    const newNote: ReaderNote = {
      id: `note-${Date.now()}`,
      bookId: book.id,
      chapterId: currentChapter.id,
      selectedText: `Chapter ${currentChapter.chapterNumber}: ${currentChapter.title}`,
      note: noteInput.trim(),
      timestamp: new Date().toLocaleDateString(),
    };

    setNotes([newNote, ...notes]);
    setNoteInput('');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen) return null;

  // Theme styling definitions
  const themeStyles = {
    dark: {
      bg: 'bg-[#0B0F19]',
      panel: 'bg-[#0F172A]',
      text: 'text-slate-200',
      heading: 'text-white',
      border: 'border-slate-800',
      subtext: 'text-slate-400',
      activeTab: 'bg-blue-600 text-white',
    },
    light: {
      bg: 'bg-[#F8FAFC]',
      panel: 'bg-white',
      text: 'text-slate-800',
      heading: 'text-slate-900',
      border: 'border-slate-200',
      subtext: 'text-slate-500',
      activeTab: 'bg-blue-600 text-white',
    },
    sepia: {
      bg: 'bg-[#F5EADB]',
      panel: 'bg-[#EBDBC8]',
      text: 'text-[#433422]',
      heading: 'text-[#2D2214]',
      border: 'border-[#DEC7AF]',
      subtext: 'text-[#7D6B57]',
      activeTab: 'bg-[#9C7149] text-white',
    },
  }[theme];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeStyles.bg} ${themeStyles.text} transition-colors duration-300 font-sans`}>
      
      {/* Top Reader Navbar */}
      <header className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b ${themeStyles.border} ${themeStyles.panel} shadow-xs select-none shrink-0`}>
        
        {/* Left: Book Title & Chapter status */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800/30 transition-colors cursor-pointer"
            title="Exit Reader"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h3 className={`font-heading font-bold text-sm sm:text-base truncate ${themeStyles.heading}`}>
              {book.title}
            </h3>
            <p className={`text-xs ${themeStyles.subtext} truncate hidden sm:block`}>
              Chapter {currentChapter.chapterNumber} of {tableOfContents.length} • {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Center: Reading Progress */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700/40 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Progress: {readingProgress}%</span>
        </div>

        {/* Right Controls: Font size, Themes, Bookmarks, Sidebar, Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Font Resizing */}
          <div className="flex items-center border rounded-lg border-slate-700/40 px-1 py-0.5">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-1 text-xs font-bold hover:opacity-75 transition-opacity"
              title="Decrease text size"
            >
              A-
            </button>
            <span className="text-xs px-1 text-slate-400 font-mono">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(26, fontSize + 2))}
              className="px-2 py-1 text-xs font-bold hover:opacity-75 transition-opacity"
              title="Increase text size"
            >
              A+
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="hidden sm:flex items-center border rounded-lg border-slate-700/40 p-0.5 gap-0.5">
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'sepia' ? 'bg-[#9C7149] text-white' : 'text-slate-400 hover:text-white'}`}
              title="Sepia Reading Mode"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-white'}`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border border-slate-700/40 hover:opacity-80 transition-colors ${
              isCurrentBookmarked ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' : ''
            }`}
            title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark Chapter'}
          >
            {isCurrentBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Table of Contents & Notes Drawer Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-xl border border-slate-700/40 hover:opacity-80 transition-colors ${
              isSidebarOpen ? 'bg-blue-600 text-white' : ''
            }`}
            title="Table of Contents & Notes"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:inline-flex p-2 rounded-xl border border-slate-700/40 hover:opacity-80 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Reading Canvas & Sidebar layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Reader Document Area */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-12 md:px-24 py-8 sm:py-12 scroll-smooth"
        >
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Chapter Header */}
            <div className={`pb-6 border-b ${themeStyles.border} space-y-2`}>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-blue-500">
                <span>Chapter {currentChapter.chapterNumber} of {tableOfContents.length}</span>
                <span>Pages {currentChapter.pages}</span>
              </div>
              <h1 className={`font-heading font-bold text-2xl sm:text-3xl ${themeStyles.heading}`}>
                {currentChapter.title}
              </h1>
              <p className={`text-xs ${themeStyles.subtext}`}>
                {book.title} • By {book.author}
              </p>
            </div>

            {/* Reading Content */}
            <div
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.75 }}
              className="prose max-w-none space-y-6 font-serif select-text"
            >
              {currentChapter.content.split('\n\n').map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Chapter Preview Gate Notice if locked */}
            {!currentChapter.previewAvailable && (
              <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center space-y-4 my-8">
                <Sparkles className="w-8 h-8 text-blue-400 mx-auto animate-pulse" />
                <div>
                  <h4 className="font-heading font-bold text-lg text-slate-100">
                    Full Unabridged Chapter Access
                  </h4>
                  <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                    You are previewing sample chapters. Unlock the full 300+ page high-resolution PDF download instantly for only KES 100 via M-Pesa.
                  </p>
                </div>
                {onBuyNow && (
                  <button
                    onClick={() => {
                      onClose();
                      onBuyNow(book);
                    }}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Unlock Full Book for KES 100</span>
                  </button>
                )}
              </div>
            )}

            {/* Navigation Bottom Footer */}
            <div className={`pt-8 border-t ${themeStyles.border} flex items-center justify-between`}>
              <button
                disabled={currentChapterIndex === 0}
                onClick={() => {
                  setCurrentChapterIndex((prev) => Math.max(0, prev - 1));
                  contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-2.5 rounded-xl border ${themeStyles.border} flex items-center gap-2 text-sm font-semibold transition-all ${
                  currentChapterIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Chapter</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                {currentChapterIndex + 1} / {tableOfContents.length}
              </span>

              <button
                disabled={currentChapterIndex === tableOfContents.length - 1}
                onClick={() => {
                  setCurrentChapterIndex((prev) => Math.min(tableOfContents.length - 1, prev + 1));
                  contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-2.5 rounded-xl border ${themeStyles.border} flex items-center gap-2 text-sm font-semibold transition-all ${
                  currentChapterIndex === tableOfContents.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
                }`}
              >
                <span>Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Drawer: Table of Contents / Bookmarks / Notes */}
        {isSidebarOpen && (
          <aside className={`w-80 border-l ${themeStyles.border} ${themeStyles.panel} flex flex-col z-20 shrink-0 animate-slideLeft`}>
            
            {/* Sidebar Tab Nav */}
            <div className={`flex items-center border-b ${themeStyles.border} p-2 gap-1`}>
              <button
                onClick={() => setActiveSidebarTab('toc')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeSidebarTab === 'toc' ? themeStyles.activeTab : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Contents</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('bookmarks')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeSidebarTab === 'bookmarks' ? themeStyles.activeTab : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Marks ({bookmarks.length})</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('notes')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  activeSidebarTab === 'notes' ? themeStyles.activeTab : 'text-slate-400 hover:text-white'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>Notes ({notes.length})</span>
              </button>
            </div>

            {/* Sidebar Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              
              {/* 1. Table of Contents */}
              {activeSidebarTab === 'toc' && (
                <div className="space-y-1.5">
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Chapters</p>
                  {tableOfContents.map((chap, idx) => (
                    <button
                      key={chap.id}
                      onClick={() => {
                        setCurrentChapterIndex(idx);
                        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-2 text-xs ${
                        idx === currentChapterIndex
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-bold'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-mono text-[10px] text-slate-400">Chapter {chap.chapterNumber}</div>
                        <div className="mt-0.5">{chap.title}</div>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0">{chap.pages}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 2. Bookmarks List */}
              {activeSidebarTab === 'bookmarks' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Saved Bookmarks</p>
                    <button
                      onClick={toggleBookmark}
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Bookmark current</span>
                    </button>
                  </div>

                  {bookmarks.length > 0 ? (
                    bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        onClick={() => {
                          const targetIdx = tableOfContents.findIndex((c) => c.id === bm.chapterId);
                          if (targetIdx !== -1) {
                            setCurrentChapterIndex(targetIdx);
                            contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between group text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-200 truncate">{bm.title}</div>
                          <div className="text-[10px] text-slate-500">{bm.timestamp}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookmarks(bookmarks.filter((b) => b.id !== bm.id));
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400 space-y-1">
                      <Bookmark className="w-6 h-6 mx-auto text-slate-600" />
                      <p>No bookmarks added yet.</p>
                      <p className="text-[10px] text-slate-500">Click the bookmark ribbon at the top to save locations.</p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Personal Notes */}
              {activeSidebarTab === 'notes' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Add Note to Chapter {currentChapter.chapterNumber}</p>
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Write your reflection, summary, or actionable insight here..."
                      rows={3}
                      className="w-full p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!noteInput.trim()}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Save Note
                    </button>
                  </form>

                  <div className="space-y-2">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{note.selectedText}</span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-slate-200 font-sans leading-relaxed">{note.note}</p>
                        <div className="text-[9px] text-slate-500 text-right">{note.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}
      </div>

    </div>
  );
};
