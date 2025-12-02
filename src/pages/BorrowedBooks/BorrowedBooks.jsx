import React, { useState, useEffect } from 'react';
import Table from '../../components/Table/Table';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const BorrowedBooks = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBorrowings, resMembers, resBooks] = await Promise.all([
          axios.get(`${API_URL}/borrowings`),
          axios.get(`${API_URL}/members`),
          axios.get(`${API_URL}/books`)
        ]);

        setBorrowings(resBorrowings.data.data);
        setMembers(resMembers.data.data);
        setBooks(resBooks.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsReturned = async (borrowing) => {
    if (borrowing.returned_at) return; // already returned

    try {
      await axios.put(`${API_URL}/borrowings/${borrowing.borrowing_id}/return`);

      setBorrowings(borrowings.map(b =>
        b.borrowing_id === borrowing.borrowing_id
          ? { ...b, returned_at: new Date().toISOString() }
          : b
      ));
    } catch (error) {
      console.error(error);
    }
  };

  // Map IDs to names and format dates
  const dataForTable = borrowings.map(b => {
    const member = members.find(m => m.id === b.member_id);
    const book = books.find(bk => bk.book_id === b.book_id);

    return {
      borrowing_id: b.borrowing_id,
      member_name: member ? member.full_name : b.member_id,
      book_title: book ? book.title : b.book_id,
      borrowed_at: b.borrowed_at,
      due_date: b.due_date,
      returned_at: b.returned_at,
      fine_amount: b.fine_amount,
      status: b.returned_at ? 'Returned' : 'Borrowed'
    };
  });

  const columns = [
    { key: 'borrowing_id', label: 'Borrowing ID' },
    { key: 'member_name', label: 'Member Name' },
    { key: 'book_title', label: 'Book Title' },
    { 
      key: 'borrowed_at', 
      label: 'Borrowed At', 
      render: (value) => new Date(value).toLocaleDateString() 
    },
    { 
      key: 'due_date', 
      label: 'Due Date', 
      render: (value) => new Date(value).toLocaleDateString() 
    },
    { 
      key: 'returned_at', 
      label: 'Returned At', 
      render: (value) => value ? new Date(value).toLocaleDateString() : '-' 
    },
    { key: 'fine_amount', label: 'Fine Amount' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={value === 'Returned' ? 'text-green-600 font-semibold' : 'text-blue-600 font-semibold'}>
          {value}
        </span>
      )
    }
  ];

  const actions = [
    {
      name: 'Mark as Returned',
      onClick: handleMarkAsReturned,
      disabled: (row) => row.status === 'Returned',
      className: 'bg-green-500 text-white hover:bg-green-600'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Borrowed Books</h2>
      <Table
        columns={columns}
        data={dataForTable}
        actions={actions}
      />
    </div>
  );
};

export default BorrowedBooks;