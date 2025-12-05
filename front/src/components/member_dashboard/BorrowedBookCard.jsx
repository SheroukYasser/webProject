import React from "react";

export default function BorrowedBookCard({ book, onReturn }) {
  const isOverdue = new Date(book.dueDate) < new Date();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 flex flex-col justify-between gap-4 max-w-sm mx-auto">
      <div>
        <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{book.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-1">Author: {book.author}</p>
        <p className="text-gray-700 dark:text-gray-300">
          Due Date:{" "}
          <span className={isOverdue ? "text-red-500" : "text-green-500"}>
            {book.dueDate}
          </span>
        </p>
      </div>

      <button
        onClick={onReturn}
        className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full hover:scale-105 duration-200"
      >
        Return
      </button>
    </div>
  );
}