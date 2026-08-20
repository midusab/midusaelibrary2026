import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export interface Book {
  id?: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  coverColor: string;
  description: string;
  category: string;
  pages?: number;
  language?: string;
  publishedYear?: number;
  pdfUrl?: string;
  salesCount?: number;
  createdAt?: any;
}

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  items: { bookId: string; title: string; price: number }[];
  totalAmount: number;
  status: string;
  mpesaReceipt?: string;
  createdAt?: any;
}

export const booksCollection = collection(db, "books");
export const ordersCollection = collection(db, "orders");

export async function getBooks() {
  const snapshot = await getDocs(
    query(booksCollection, orderBy("createdAt", "desc")),
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Book);
}

export async function getBook(id: string) {
  const d = await getDoc(doc(db, "books", id));
  if (d.exists()) {
    return { id: d.id, ...d.data() } as Book;
  }
  return null;
}

export async function addBook(book: Omit<Book, "id">) {
  const docRef = await addDoc(booksCollection, {
    ...book,
    createdAt: serverTimestamp(),
    salesCount: 0,
  });
  return docRef.id;
}

export async function updateBook(id: string, updates: Partial<Book>) {
  await updateDoc(doc(db, "books", id), updates);
}

export async function deleteBook(id: string) {
  await deleteDoc(doc(db, "books", id));
}

export async function getOrders() {
  const snapshot = await getDocs(
    query(ordersCollection, orderBy("createdAt", "desc")),
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
}

export async function addOrder(order: Omit<Order, "id">) {
  const docRef = await addDoc(ordersCollection, {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOrderStatus(id: string, status: string) {
  await updateDoc(doc(db, "orders", id), { status });
}

export function waitForAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(user);
      unsubscribe();
    });
  });
}
