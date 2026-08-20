import React, { useState, useEffect } from 'react';
import { Book, BookCategory, CartItem, UserProfile, AppView, PurchasedBook, OrderTransaction } from './types';
import { BOOKS_DATA } from './data/booksData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedBooks } from './components/FeaturedBooks';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { BookDetailPage } from './components/BookDetailPage';
import { UserProfilePage } from './components/UserProfilePage';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MpesaPaymentModal } from './components/MpesaPaymentModal';

// Initial default purchased books for realistic instant testing
const INITIAL_PURCHASED_BOOKS: PurchasedBook[] = [
  {
    id: 'pur-01',
    book: BOOKS_DATA[0], // Atomic Habits
    purchaseDate: '2026-08-18',
    mpesaReceiptNumber: 'QK89XLP20A',
    uniqueDownloadToken: 'dl_atomichabits_9f821a',
    downloadUrl: `https://midusaelibrary.com/download/pdf?token=dl_atomichabits_9f821a&book=book-01`,
    downloadCount: 3,
    phoneNumber: '0712345678',
  },
  {
    id: 'pur-02',
    book: BOOKS_DATA[1], // The Psychology of Money
    purchaseDate: '2026-08-19',
    mpesaReceiptNumber: 'QK91ND884B',
    uniqueDownloadToken: 'dl_psychmoney_8b172a',
    downloadUrl: `https://midusaelibrary.com/download/pdf?token=dl_psychmoney_8b172a&book=book-02`,
    downloadCount: 1,
    phoneNumber: '0712345678',
  }
];

const INITIAL_ORDERS: OrderTransaction[] = [
  {
    orderId: 'MID-2026-8891',
    mpesaReceiptNumber: 'QK89XLP20A',
    phoneNumber: '0712345678',
    date: 'August 18, 2026',
    amountKES: 100,
    items: [
      {
        bookId: 'book-01',
        bookTitle: 'Atomic Habits',
        priceKES: 100,
        uniqueDownloadToken: 'dl_atomichabits_9f821a',
      }
    ],
    status: 'completed',
  },
  {
    orderId: 'MID-2026-8904',
    mpesaReceiptNumber: 'QK91ND884B',
    phoneNumber: '0712345678',
    date: 'August 19, 2026',
    amountKES: 100,
    items: [
      {
        bookId: 'book-02',
        bookTitle: 'The Psychology of Money',
        priceKES: 100,
        uniqueDownloadToken: 'dl_psychmoney_8b172a',
      }
    ],
    status: 'completed',
  }
];

export default function App() {
  // Navigation & Page View State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Global State (Kenyan Shillings 100 KES standard)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { book: BOOKS_DATA[2], quantity: 1 },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['book-03', 'book-05']);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Slide-out Drawers for Cart and Wishlist
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // M-Pesa Direct Checkout Modal State
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [mpesaBookToBuy, setMpesaBookToBuy] = useState<Book | null>(null);
  const [mpesaCartItemsToBuy, setMpesaCartItemsToBuy] = useState<CartItem[]>([]);

  // User Auth Profile (Google / Facebook / M-Pesa)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('midusa_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return {
      id: 'alex-kariuki',
      name: 'Alex Kariuki',
      email: 'alex.kariuki@gmail.com',
      phone: '0712345678',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      provider: 'google',
    };
  });

  // Purchased eBooks & Download Links with persistence
  const [purchasedBooks, setPurchasedBooks] = useState<PurchasedBook[]>(() => {
    const saved = localStorage.getItem('midusa_purchased_books');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_PURCHASED_BOOKS; }
    }
    return INITIAL_PURCHASED_BOOKS;
  });

  const [orderTransactions, setOrderTransactions] = useState<OrderTransaction[]>(() => {
    const saved = localStorage.getItem('midusa_order_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_ORDERS; }
    }
    return INITIAL_ORDERS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('midusa_purchased_books', JSON.stringify(purchasedBooks));
  }, [purchasedBooks]);

  useEffect(() => {
    localStorage.setItem('midusa_order_history', JSON.stringify(orderTransactions));
  }, [orderTransactions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('midusa_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('midusa_user');
    }
  }, [currentUser]);

  // View Navigation Handlers
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('book-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfile = () => {
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger M-Pesa Buy Now Flow for a single book
  const handleStartBuyNow = (book: Book) => {
    setMpesaBookToBuy(book);
    setMpesaCartItemsToBuy([]);
    setIsMpesaModalOpen(true);
  };

  // Trigger M-Pesa Checkout Flow for Cart
  const handleStartCartCheckout = () => {
    if (cartItems.length === 0) return;
    setMpesaBookToBuy(null);
    setMpesaCartItemsToBuy(cartItems);
    setIsMpesaModalOpen(true);
  };

  // Handle M-Pesa payment success: generate unique download link & store in user profile
  const handlePaymentSuccess = ({
    books,
    phoneNumber,
    mpesaReceipt,
    downloadToken,
  }: {
    books: Book[];
    phoneNumber: string;
    mpesaReceipt: string;
    downloadToken: string;
  }) => {
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newPurchasedItems: PurchasedBook[] = books.map((b, idx) => {
      const itemToken = `${downloadToken}_${idx}`;
      return {
        id: `pur-${Date.now()}-${idx}`,
        book: b,
        purchaseDate: nowStr,
        mpesaReceiptNumber: mpesaReceipt,
        uniqueDownloadToken: itemToken,
        downloadUrl: `${window.location.origin}/download/pdf?token=${itemToken}&book=${b.id}`,
        downloadCount: 0,
        phoneNumber,
        expiresAt: Date.now() + 10 * 60 * 1000, // Expires after 10 minutes
      };
    });

    // Prepend new purchases
    setPurchasedBooks((prev) => [...newPurchasedItems, ...prev]);

    // Create Order Transaction Record
    const newOrder: OrderTransaction = {
      orderId: `MID-${Date.now().toString().slice(-4)}`,
      mpesaReceiptNumber: mpesaReceipt,
      phoneNumber,
      date: nowStr,
      amountKES: books.reduce((sum, b) => sum + b.priceKES, 0),
      items: books.map((b, idx) => ({
        bookId: b.id,
        bookTitle: b.title,
        priceKES: b.priceKES,
        uniqueDownloadToken: `${downloadToken}_${idx}`,
      })),
      status: 'completed',
    };

    setOrderTransactions((prev) => [newOrder, ...prev]);

    // Ensure user session exists
    if (!currentUser) {
      setCurrentUser({
        id: `mpesa-${phoneNumber}`,
        name: `Customer (${phoneNumber})`,
        email: `${phoneNumber}@mpesa.midusa.co.ke`,
        phone: phoneNumber,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        provider: 'mpesa',
      });
    }

    // If checkout was from cart, clear purchased books from cart
    if (mpesaCartItemsToBuy.length > 0) {
      setCartItems([]);
    }
  };

  // Cart Operations
  const handleAddToCart = (book: Book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(bookId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Operations
  const handleToggleWishlist = (book: Book) => {
    setWishlistIds((prev) => {
      if (prev.includes(book.id)) {
        return prev.filter((id) => id !== book.id);
      }
      return [...prev, book.id];
    });
  };

  const handleRemoveWishlist = (bookId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== bookId));
  };

  const wishlistBooks = BOOKS_DATA.filter((b) => wishlistIds.includes(b.id));

  // Smooth scroll helper
  const handleScrollToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-700">
      
      {/* Top Navigation Bar */}
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenProfile={handleOpenProfile}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* 1. Hero Section */}
            <Hero
              featuredBooks={BOOKS_DATA}
              onBrowseBooks={() => handleScrollToSection('catalog')}
              onPreviewBook={handleSelectBook}
              onBuyNow={handleStartBuyNow}
            />

            {/* 2. Categories Section */}
            <CategoriesSection
              onSelectCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              onScrollToCatalog={() => handleScrollToSection('catalog')}
            />

            {/* 3. Featured Books Catalog */}
            <FeaturedBooks
              books={BOOKS_DATA}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onPreviewBook={handleSelectBook}
              onBuyNow={handleStartBuyNow}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />

            {/* 4. Why Choose MidusaElibrary */}
            <WhyChooseUs />

            {/* 5. Reader Testimonials */}
            <Testimonials />

            {/* 6. Frequently Asked Questions */}
            <FaqSection />

            {/* 7. Newsletter */}
            <Newsletter />
          </>
        )}

        {/* Dedicated Book Details Page */}
        {currentView === 'book-detail' && (
          <BookDetailPage
            book={selectedBook || BOOKS_DATA[0]}
            allBooks={BOOKS_DATA}
            onBack={handleNavigateHome}
            onSelectBook={handleSelectBook}
            onBuyNow={handleStartBuyNow}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {/* Dedicated User Profile Page */}
        {currentView === 'profile' && (
          <UserProfilePage
            currentUser={currentUser}
            onLogin={setCurrentUser}
            onLogout={() => setCurrentUser(null)}
            onBack={handleNavigateHome}
            books={BOOKS_DATA}
            purchasedBooks={purchasedBooks}
            orderTransactions={orderTransactions}
            wishlistBooks={wishlistBooks}
            onRemoveWishlist={handleRemoveWishlist}
            onAddToCart={handleAddToCart}
            onSelectBook={handleSelectBook}
            onBuyNow={handleStartBuyNow}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigateHome();
          setTimeout(() => handleScrollToSection('catalog'), 100);
        }}
        onScrollToSection={handleScrollToSection}
      />

      {/* Slide-over Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutWithMpesa={handleStartCartCheckout}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistBooks={wishlistBooks}
        onRemoveWishlist={handleRemoveWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Interactive M-Pesa Payment STK Push & Download Link Modal */}
      <MpesaPaymentModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        book={mpesaBookToBuy}
        cartItems={mpesaCartItemsToBuy}
        onPaymentSuccess={handlePaymentSuccess}
        onNavigateToProfile={handleOpenProfile}
      />

      {/* Floating WhatsApp Quick Concierge */}
      <FloatingWhatsApp currentBookTitle={selectedBook?.title || BOOKS_DATA[0]?.title} />

    </div>
  );
}
