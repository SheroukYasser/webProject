import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "../Table/Table";
import { FaBookReader } from "react-icons/fa";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  const fetchBooks = async () => {
    
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Please log in to view and borrow books.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks(res.data.data || []); // Adjust if API returns books array differently
    } catch (err) {
      console.error("Error fetching books:", err);
      if (err.response && err.response.status === 401) {
        setError(
          "Access Denied (401): Your session has expired or the token is invalid. Please log in again."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to handle borrowing a book
  const handleBorrow = async (book) => {
  if (book.available_copies === 0) {
    alert(`Sorry, "${book.title}" is currently out of stock.`);
    return;
  }

  try {
    const token = localStorage.getItem("accessToken");
    const bookId = book.book_id
    if (!token) {
      alert("Please log in first.");
      return;
    }

    const res = await axios.post(
      `http://localhost:5000/api/reservations/${bookId}`,
    //   bookId: book.book_id
       {  },                  // <-- إرسال book_id في body
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(res.data.message);

    // تحديث قائمة الكتب بعد الاستعارة
    fetchBooks();
  } catch (err) {
    console.error(err);
    if (err.response && err.response.data?.message) {
      alert(err.response.data.message);
    } else {
      alert("Failed to borrow the book.");
    }
  }
};




  // Table columns
  const columns = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    // { key: "available_copies", label: "Available Copies" },
  ];

  // Actions for each row (borrow button)
  const actions = [
    {
      label: "Borrow",
      icon: <FaBookReader />,
      onClick: handleBorrow,
      className: (book) =>
        book.available_copies > 0
          ? "bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          : "bg-gray-400 text-white px-2 py-1 rounded cursor-not-allowed",
      disabled: (book) => book.available_copies === 0,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Books</h1>

      {loading && <p>Loading books...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <Table columns={columns} data={books} actions={actions} />}
    </div>
  );
};

export default BooksPage;
