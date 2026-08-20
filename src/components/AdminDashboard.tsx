import React, { useState, useEffect } from "react";
import {
  Book,
  Order,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getOrders,
  updateOrderStatus,
  waitForAuth,
} from "../lib/db";
import {
  Edit2,
  Trash2,
  Plus,
  X,
  LayoutDashboard,
  Package,
  Library,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { seedBooksIfEmpty } from "../lib/seed";

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "books" | "orders">(
    "overview",
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: 100,
    category: "",
    image: "",
    coverColor: "#1e40af",
    description: "",
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const user = await waitForAuth();
        if (!user) {
          setError("You must be logged in to view the admin dashboard.");
          setLoading(false);
          return;
        }
        await seedBooksIfEmpty();
        await fetchData();
      } catch (err: any) {
        console.error("Dashboard init error:", err);
        setError(
          err.message ||
            "Failed to load dashboard data. Check your permissions.",
        );
      }
    };
    init();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const b = await getBooks();
      const o = await getOrders();
      setBooks(b);
      setOrders(o);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to load dashboard data.");
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image,
        coverColor: formData.coverColor,
        description: formData.description,
        rating: 5.0,
        reviews: 0,
      };

      if (editingBook && editingBook.id) {
        await updateBook(editingBook.id, payload);
      } else {
        await addBook(payload);
      }
      setIsFormOpen(false);
      setFormData({
        title: "",
        author: "",
        price: 100,
        category: "",
        image: "",
        coverColor: "#1e40af",
        description: "",
      });
      setEditingBook(null);
      await fetchData();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      category: book.category,
      image: book.image,
      coverColor: book.coverColor,
      description: book.description,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setLoading(true);
    await deleteBook(id);
    await fetchData();
  };

  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-2 block"
            >
              ← Back to Store
            </button>
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-dodgerblue text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "books" ? "bg-dodgerblue text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Books
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "orders" ? "bg-dodgerblue text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Orders
            </button>
          </div>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl mb-6">
            <p className="font-semibold text-sm">Access Denied</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs text-red-500 mt-2">
              Try logging out and logging in again with Google to refresh your
              admin credentials.
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-dodgerblue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <p className="text-sm font-medium text-slate-500">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      KES {totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <p className="text-sm font-medium text-slate-500">
                      Total Orders
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {orders.length}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <p className="text-sm font-medium text-slate-500">
                      Books Available
                    </p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {books.length}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    Book Sales Analytics (Most Purchased)
                  </h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={books
                          .sort(
                            (a, b) => (b.salesCount || 0) - (a.salesCount || 0),
                          )
                          .slice(0, 10)}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="title"
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar
                          dataKey="salesCount"
                          fill="#1E90FF"
                          radius={[4, 4, 0, 0]}
                          name="Sales"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKS TAB */}
            {activeTab === "books" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Manage Books
                  </h2>
                  <button
                    onClick={() => {
                      setEditingBook(null);
                      setFormData({
                        title: "",
                        author: "",
                        price: 100,
                        category: "",
                        image: "",
                        coverColor: "#1e40af",
                        description: "",
                      });
                      setIsFormOpen(true);
                    }}
                    className="px-4 py-2 bg-dodgerblue text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Book
                  </button>
                </div>

                {isFormOpen && (
                  <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        {editingBook ? "Edit Book" : "Add New Book"}
                      </h3>
                      <button onClick={() => setIsFormOpen(false)}>
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                    <form onSubmit={handleSave} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Title
                          </label>
                          <input
                            required
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Author
                          </label>
                          <input
                            required
                            value={formData.author}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                author: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Price (KES)
                          </label>
                          <input
                            required
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Category
                          </label>
                          <input
                            required
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Image URL
                          </label>
                          <input
                            required
                            value={formData.image}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                image: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Cover Color (HEX)
                          </label>
                          <input
                            required
                            value={formData.coverColor}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                coverColor: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Description
                        </label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-24"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-dodgerblue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          Save Book
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-3 font-semibold text-slate-900">
                          Book
                        </th>
                        <th className="pb-3 font-semibold text-slate-900">
                          Price
                        </th>
                        <th className="pb-3 font-semibold text-slate-900">
                          Sales
                        </th>
                        <th className="pb-3 font-semibold text-slate-900 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {books.map((book) => (
                        <tr key={book.id}>
                          <td className="py-4">
                            <div className="font-medium text-slate-900">
                              {book.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {book.author}
                            </div>
                          </td>
                          <td className="py-4 text-slate-600">
                            KES {book.price}
                          </td>
                          <td className="py-4 text-slate-600">
                            {book.salesCount || 0}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleEdit(book)}
                              className="text-slate-400 hover:text-dodgerblue mx-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => book.id && handleDelete(book.id)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {books.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-slate-500"
                          >
                            No books found in database
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Recent Orders
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-3 font-semibold text-slate-900">
                          Order ID / Date
                        </th>
                        <th className="pb-3 font-semibold text-slate-900">
                          Customer
                        </th>
                        <th className="pb-3 font-semibold text-slate-900">
                          Items
                        </th>
                        <th className="pb-3 font-semibold text-slate-900">
                          Amount
                        </th>
                        <th className="pb-3 font-semibold text-slate-900">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="py-4">
                            <div className="font-medium text-slate-900">
                              {order.id?.slice(0, 8)}...
                            </div>
                            <div className="text-xs text-slate-500">
                              {order.createdAt?.toDate
                                ? order.createdAt.toDate().toLocaleDateString()
                                : "Just now"}
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="text-slate-900">
                              {order.userEmail}
                            </div>
                            <div className="text-xs text-slate-500">
                              {order.userId}
                            </div>
                          </td>
                          <td className="py-4 text-slate-600 text-xs">
                            {order.items.map((item, i) => (
                              <div key={i}>{item.title}</div>
                            ))}
                          </td>
                          <td className="py-4 font-medium text-slate-900">
                            KES {order.totalAmount}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-slate-500"
                          >
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
