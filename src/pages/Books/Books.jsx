import React, { useState, useEffect } from 'react';
import Table from '../../components/Table/Table';
import BookForm from '../../components/BookForm/BookForm';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch books + categories on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBooks, resCategories] = await Promise.all([
          axios.get(`${API_URL}/books`),
          axios.get(`${API_URL}/categories`)
        ]);

        setBooks(resBooks.data.data);
        setCategories(resCategories.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (book) => {
    try {
      await axios.delete(`${API_URL}/books/${book.book_id}`);
      setBooks(books.filter((b) => b.book_id !== book.book_id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (bookData) => {
    try {
      if (editingBook) {
        // update
        const res = await axios.put(
          `${API_URL}/books/${editingBook.book_id}`,
          bookData
        );

        setBooks(
          books.map((b) =>
            b.book_id === editingBook.book_id ? res.data.data : b
          )
        );
      } else {
        // create
        const res = await axios.post(`${API_URL}/books`, bookData);
        setBooks([...books, res.data.data]);
      }

      setEditingBook(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Representation columns (updated!)
  const columns = [
    { key: 'book_id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'category_name', label: 'Category' },
    { key: 'total_copies', label: 'Total Copies' },
    { key: 'borrowed_count', label: 'Borrowed' },
    {
      key: 'available_copies',
      label: 'Available Copies',
      render: (value) => (
        <span className={value === 0 ? 'text-red-500 font-bold' : 'text-green-600'}>
          {value}
        </span>
      ),
    },
  ];

  // Map backend data to table data (attach category name + compute available copies)
  const tableData = books.map((book) => {
    const category = categories.find(
      (c) => c.category_id === book.category_id
    );

    return {
      ...book,
      category_name: category ? category.name : 'Unknown',
      available_copies: book.total_copies - book.borrowed_count,
    };
  });

  const actions = [
    { name: 'Edit', onClick: handleEdit },
    {
      name: 'Delete',
      onClick: handleDelete,
      className: 'bg-red-500 text-white hover:bg-red-600',
    },
  ];

  return (
    <div>
      <button
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => {
          setEditingBook(null);
          setShowForm(true);
        }}
      >
        Add Book
      </button>

      {showForm && (
        <BookForm
          book={editingBook}
          categories={categories}
          onSave={handleFormSubmit}
        />
      )}

      <Table columns={columns} data={tableData} actions={actions} />
    </div>
  );
};

export default Books;
