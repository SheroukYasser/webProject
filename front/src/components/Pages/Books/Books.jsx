import React, { useState, useEffect } from 'react';
import Table from "../../Table/Table.jsx";
import BookForm from "../../BookForm/BookForm";
import axios from 'axios';
import API from "../../../api";

const API_URL = 'http://localhost:5000';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBooks, resCategories] = await Promise.all([
          API.get(`/books`),
          API.get(`/categories`)
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
      await API.delete(`/books/${book.book_id}`);
      setBooks(books.filter((b) => b.book_id !== book.book_id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (bookData) => {
    try {
      if (editingBook) {
        const res = await API.put(`/books/${editingBook.book_id}`, bookData);
        setBooks(books.map(b => b.book_id === editingBook.book_id ? res.data.data : b));
      } else {
        const res = await API.post(`/books`, bookData);
        setBooks([...books, res.data.data]);
      }
      setEditingBook(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

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
        <span className={`font-semibold px-2 py-1 rounded ${
          value === 0 ? 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300' 
                      : 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300'}`}>
          {value}
        </span>
      ),
    },
  ];

  const tableData = books.map((book) => {
    const category = categories.find(c => c.category_id === book.category_id);
    return {
      ...book,
      category_name: category ? category.name : 'Unknown',
      available_copies: book.total_copies - book.borrowed_count,
    };
  });

  const actions = [
    { 
      name: 'Edit', 
      onClick: handleEdit,
      className: 'bg-primary/20 text-primary hover:bg-primary/30 dark:text-primary/80 dark:hover:bg-primary/50 px-3 py-1 rounded transition'
    },
    { 
      name: 'Delete', 
      onClick: handleDelete, 
      className: 'bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded transition' 
    },
  ];

  return (
    <div className="space-y-4">
      <button
        className="mb-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full hover:scale-105 transition duration-200"
        onClick={() => { setEditingBook(null); setShowForm(true); }}
      >
        Add Book
      </button>

      {showForm && <BookForm book={editingBook} categories={categories} onSave={handleFormSubmit} />}

      <Table columns={columns} data={tableData} actions={actions} />
    </div>
  );
};

export default Books;
