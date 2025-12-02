import React, { useEffect, useState } from 'react';
import StatsCard from '../../components/StatsCard/StatsCard';
import axios from 'axios';
import BooksChart from '../../components/BooksChart/BooksChart';

const API_URL = 'http://localhost:5000';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrowed: 0,
    uniqueBooks: 0,
    totalUsers: 0,
    totalCategories: 0,
    mostBorrowedBook: '',
    mostActiveUser: '',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, borrowingsRes, usersRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/books`),
          axios.get(`${API_URL}/borrowings`),
          axios.get(`${API_URL}/members`),
          axios.get(`${API_URL}/categories`)
        ]);

        const books = booksRes.data.data;
        const borrowings = borrowingsRes.data.data;
        const users = usersRes.data.data;
        const categories = categoriesRes.data.data;

        // Calculate most borrowed book
        const borrowCountMap = {};
        borrowings.forEach(b => {
          borrowCountMap[b.book_id] = (borrowCountMap[b.book_id] || 0) + 1;
        });
        const mostBorrowedBookId = Object.keys(borrowCountMap).reduce((a, b) =>
          borrowCountMap[a] > borrowCountMap[b] ? a : b
        );
        const mostBorrowedBook = books.find(b => b.book_id === parseInt(mostBorrowedBookId))?.title || 'N/A';

        // Calculate most active user
        const userBorrowMap = {};
        borrowings.forEach(b => {
          userBorrowMap[b.member_id] = (userBorrowMap[b.member_id] || 0) + 1;
        });
        const mostActiveUserId = Object.keys(userBorrowMap).reduce((a, b) =>
          userBorrowMap[a] > userBorrowMap[b] ? a : b
        );
        const mostActiveUser = users.find(u => u.id === parseInt(mostActiveUserId))?.full_name || 'N/A';

        setStats({
          totalBooks: books.length,
          totalBorrowed: borrowings.filter(b => !b.returned_at).length,
          uniqueBooks: new Set(books.map(b => b.title)).size,
          totalUsers: users.length,
          totalCategories: categories.length,
          mostBorrowedBook,
          mostActiveUser,
        });

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="Total Books" value={stats.totalBooks} />
        <StatsCard title="Borrowed Books" value={stats.totalBorrowed} />
        <StatsCard title="Unique Books" value={stats.uniqueBooks} />
        <StatsCard title="Users" value={stats.totalUsers} />
        <StatsCard title="Categories" value={stats.totalCategories} />
        <StatsCard title="Most Borrowed Book" value={stats.mostBorrowedBook} />
        <StatsCard title="Most Active User" value={stats.mostActiveUser} />
      </div>

      {/* Chart */}
      <BooksChart
        available={stats.totalBooks - stats.totalBorrowed}
        borrowed={stats.totalBorrowed}
      />
    </div>
  );
};

export default Dashboard;
