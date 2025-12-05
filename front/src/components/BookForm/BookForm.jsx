import React, { useState } from "react";

const BookForm = ({ onSave, book, categories }) => {
  // Initial form values (loaded once per mount)
  const [formData, setFormData] = useState(() => ({
    title: book?.title || "",
    author: book?.author || "",
    category_id: book?.category_id || "",
    total_copies: book?.total_copies || 1,
    available: book?.available ?? true,
    borrowed_count: book?.borrowed_count || 0,
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, book_id: book?.book_id });

    if (!book) {
      setFormData({
        title: "",
        author: "",
        category_id: "",
        total_copies: 1,
        available: true,
        borrowed_count: 0,
      });
    }
  };

  return (
    <form
      key={book?.book_id || "new"} // Forces re-mount when editing a new book
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow rounded flex flex-col gap-3"
    >
      <h2 className="text-xl font-semibold">
        {book ? "Edit Book" : "Add New Book"}
      </h2>

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Book Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      {/* Author */}
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={formData.author}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      {/* Category */}
      <select
        name="category_id"
        value={formData.category_id}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="">Select Category</option>
        {categories?.map((cat) => (
          <option key={cat.category_id} value={cat.category_id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Total Copies */}
      <input
        type="number"
        name="total_copies"
        min="1"
        value={formData.total_copies}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      {/* Borrowed Count */}
      <input
        type="number"
        name="borrowed_count"
        min="0"
        value={formData.borrowed_count}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Availability */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="available"
          checked={formData.available}
          onChange={handleChange}
        />
        Available
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {book ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
};

export default BookForm;