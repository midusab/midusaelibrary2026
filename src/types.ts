export type AppView = 
  | 'home' 
  | 'book-detail' 
  | 'profile' 
  | 'about' 
  | 'contact' 
  | 'terms' 
  | 'privacy' 
  | 'refund' 
  | 'reader' 
  | 'bestsellers' 
  | 'newarrivals';

export type BookCategory = 
  | 'Self Development'
  | 'Business'
  | 'Psychology'
  | 'Finance'
  | 'Entrepreneurship';

export interface TableOfContentItem {
  id: string;
  chapterNumber: number;
  title: string;
  pages: string;
  previewAvailable: boolean;
  content: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface ReaderBookmark {
  id: string;
  bookId: string;
  chapterId: string;
  pageNumber: number;
  title: string;
  timestamp: string;
}

export interface ReaderNote {
  id: string;
  bookId: string;
  chapterId: string;
  selectedText: string;
  note: string;
  timestamp: string;
  color?: string;
}

export interface Book {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  author: string;
  authorBio?: string;
  priceKES: number; // 100 KSh
  originalPriceKES: number;
  rating: number;
  reviewsCount: number;
  category: BookCategory;
  pages: number;
  fileSize: string;
  publicationYear?: number;
  editionYear?: number;
  isRecentlyUploaded?: boolean;
  isBestSeller?: boolean;
  uploadedAt?: string;
  badge?: string;
  coverGradient: {
    from: string;
    via?: string;
    to: string;
    accent: string;
  };
  coverPattern: string;
  description: string;
  keyTakeaways: string[];
  tableOfContents?: TableOfContentItem[];
  reviews?: BookReview[];
}

export interface CategoryInfo {
  id: string;
  name: BookCategory;
  slug: string;
  iconName: string;
  count: number;
  description: string;
  accentColor: string;
  gradient: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  bookTitle: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  provider: 'google' | 'facebook' | 'mpesa' | 'email';
}

export interface PurchasedBook {
  id: string;
  book: Book;
  purchaseDate: string;
  mpesaReceiptNumber: string;
  uniqueDownloadToken: string;
  downloadUrl: string;
  downloadCount: number;
  phoneNumber: string;
  expiresAt?: number; // Internal 10-minute expiry timestamp
}

export interface OrderTransaction {
  orderId: string;
  mpesaReceiptNumber: string;
  phoneNumber: string;
  date: string;
  amountKES: number;
  items: {
    bookId: string;
    bookTitle: string;
    priceKES: number;
    uniqueDownloadToken: string;
  }[];
  status: 'completed' | 'processing' | 'failed';
}
