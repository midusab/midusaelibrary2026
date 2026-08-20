import { Book, TableOfContentItem, BookReview } from '../types';

export function formatPrice(priceKES: number = 100): string {
  return `KSh ${Math.round(priceKES).toLocaleString()}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function findBookBySlug(slug: string, books: Book[]): Book | undefined {
  return books.find((b) => (b.slug || slugify(b.title)) === slug || b.id === slug);
}

export function getBookTableOfContents(book: Book): TableOfContentItem[] {
  if (book.tableOfContents && book.tableOfContents.length > 0) {
    return book.tableOfContents;
  }

  return [
    {
      id: `${book.id}-ch1`,
      chapterNumber: 1,
      title: 'Foundations & Paradigm Shift',
      pages: '1 - 42',
      previewAvailable: true,
      content: `The secret to lasting transformation is not dramatic overhaul, but atomic momentum. Every significant output in human performance traces back to the silent compounding of micro-decisions made when friction is low.\n\nWhen we examine high-leverage thinkers and operators, their advantage rarely stems from raw motivation. Motivation is a fleeting neurochemical spike. What sustains peak execution is the architecture of the environment—designing defaults where the right action requires less cognitive resistance than procrastination.\n\nIn this opening chapter, we deconstruct the baseline mental models that separate reactive effort from systematic leverage. By establishing clear feedback loops and cognitive triggers, you build an automated bridge between intention and immediate execution.`,
    },
    {
      id: `${book.id}-ch2`,
      chapterNumber: 2,
      title: 'The Neurological Feedback Loop',
      pages: '43 - 98',
      previewAvailable: true,
      content: `Behind every consistent habit lies a predictable four-stage loop: cue, craving, response, and reward. When dopamine spikes prior to an action, the brain encodes that sequence as a survival priority.\n\nBy intentionally inserting deliberate friction into low-value distractions while lubricating high-value deep work routines, you effortlessly retrain your basal ganglia. This chapter provides step-by-step diagnostic worksheets to map your personal cue-response triggers and eliminate subconscious energy leaks.`,
    },
    {
      id: `${book.id}-ch3`,
      chapterNumber: 3,
      title: 'High-Leverage Execution Systems',
      pages: '99 - 164',
      previewAvailable: false,
      content: `Execution without leverage is merely exhaustion disguised as productivity. True compounding occurs when you build systems that work asynchronously on your behalf.\n\nWe explore the 5 core leverage multipliers: code, capital, media, delegation, and cognitive models. You will learn to audit your weekly schedule, strip away zero-sum busywork, and allocate uninterrupted blocks of focused deep time toward your single highest ROI objective.`,
    },
    {
      id: `${book.id}-ch4`,
      chapterNumber: 4,
      title: 'Dopamine Architecture & Mental Stamina',
      pages: '165 - 238',
      previewAvailable: false,
      content: `Modern digital environments are engineered to hijack human neurochemistry. In this chapter, we outline the 14-day dopamine reset protocol.\n\nLearn how to lower baseline sensory overload, restore high-focus neurochemical sensitivity, and enter flow states within 90 seconds of initiating complex analytical work.`,
    },
    {
      id: `${book.id}-ch5`,
      chapterNumber: 5,
      title: 'Mastery, Compounding & Long-Term Moats',
      pages: '239 - 310',
      previewAvailable: false,
      content: `Long-term defensibility is created at the intersection of unique knowledge, persistent iteration, and emotional resilience.\n\nFinalizing the playbook, this concluding section synthesizes daily routines into an unbreakable operating rhythm that compounds for decades.`,
    },
  ];
}

export function getBookReviews(book: Book): BookReview[] {
  if (book.reviews && book.reviews.length > 0) {
    return book.reviews;
  }

  return [
    {
      id: `${book.id}-rev-1`,
      bookId: book.id,
      userName: 'David Mwangi',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      date: '2 days ago',
      title: 'Instant M-Pesa download & incredible clarity!',
      comment: `Purchased via M-Pesa in under 30 seconds. The PDF rendered crystal clear on my iPad and Kindle app. The takeaways in chapters 2 & 3 alone completely shifted how I structure my mornings.`,
      verifiedPurchase: true,
    },
    {
      id: `${book.id}-rev-2`,
      bookId: book.id,
      userName: 'Faith Chebet',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      rating: 5,
      date: '1 week ago',
      title: 'Unbelievable value for 100 KES',
      comment: `I was skeptical at first about 100 KES, but this is the full, unabridged high-res PDF edition. No ads, clean typography, and direct download links. Highly recommend to any serious reader.`,
      verifiedPurchase: true,
    },
    {
      id: `${book.id}-rev-3`,
      bookId: book.id,
      userName: 'Brian Otieno',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 4.9,
      date: '2 weeks ago',
      title: 'A masterclass in practical execution',
      comment: `The author breaks down complex concepts into actionable daily systems. MidusaElibrary's web reader is also super handy when I am on my laptop during commutes.`,
      verifiedPurchase: true,
    },
  ];
}

export function generateWhatsAppUrl(bookTitle?: string, customText?: string): string {
  const phoneNumber = '1234567890';
  if (customText) {
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customText)}`;
  }
  const text = bookTitle
    ? `Hello MidusaElibrary, I would like to buy the eBook "${bookTitle}". Please share payment and download details.`
    : 'Hello MidusaElibrary, I would like to purchase an eBook.';

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
}

export function generateCartWhatsAppUrl(
  items: { book: Book; quantity: number }[],
  totalKES: number
): string {
  const phoneNumber = '1234567890';
  const itemListText = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.book.title} (x${item.quantity}) - KSh ${item.quantity * 100}`
    )
    .join('\n');

  const message = `Hello MidusaElibrary! 📚\n\nI would like to purchase the following books:\n\n${itemListText}\n\n*Total Amount:* KSh ${totalKES.toLocaleString()}\n\nPlease send M-Pesa / Card payment instructions and the instant download links!`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
