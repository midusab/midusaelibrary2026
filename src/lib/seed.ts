import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { BOOKS_DATA } from '../data/booksData';

export async function seedBooksIfEmpty() {
  const snapshot = await getDocs(collection(db, 'books'));
  if (snapshot.empty) {
    console.log("Seeding initial books to Firestore...");
    for (const book of BOOKS_DATA) {
      await addDoc(collection(db, 'books'), {
        title: book.title,
        author: book.author,
        price: book.priceKES,
        rating: book.rating,
        reviews: book.reviewsCount,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
        coverColor: book.coverGradient.from,
        description: book.description,
        category: book.category,
        pages: book.pages,
        salesCount: Math.floor(Math.random() * 100),
        createdAt: new Date(),
      });
    }
  }
}
