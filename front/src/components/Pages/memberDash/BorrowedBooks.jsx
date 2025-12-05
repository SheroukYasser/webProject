import React from "react";
import BorrowedBookCard from "../../member_dashboard/BorrowedBookCard";
import useDashboardStore from "../../../store/useDashboardStore";

export default function BorrowedBooks() {
  const borrowedBooks = useDashboardStore((state) => state.borrowedBooks);
  const returnBook = useDashboardStore((state) => state.returnBook);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Borrowed Books</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {borrowedBooks.map((book) => (
          <BorrowedBookCard
            key={book.id}
            book={book}
            onReturn={() => returnBook(book.id)}
          />
        ))}
      </div>
    </div>
  );
}
