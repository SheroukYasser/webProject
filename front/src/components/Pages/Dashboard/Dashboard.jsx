import React, { useEffect, useState } from 'react';
import StatsCard from "../../StatsCard/StatsCard";
import axios from 'axios';
import BooksChart from "../../BooksChart/BooksChart";
import API from "../../../api";

const API_URL = "http://localhost:5000";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedBooks: 0,
    uniqueBooks: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, borrowingsRes, usersRes] = await Promise.all([
          API.get(`/books`),
          API.get(`/borrowings`),
          API.get(`/members`),
        ]);

        const books = booksRes.data.data;
        const borrowings = borrowingsRes.data.data;
        const users = usersRes.data.data;

        setStats({
          totalBooks: books.length,
          borrowedBooks: borrowings.length,
          uniqueBooks: new Set(books.map(b => b.title)).size,
          totalUsers: users.length,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Books" value={stats.totalBooks} />
        <StatsCard title="Borrowed Books" value={stats.borrowedBooks} />
        <StatsCard title="Unique Books" value={stats.uniqueBooks} />
        <StatsCard title="Total Users" value={stats.totalUsers} />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Books Overview</h2>
        <BooksChart available={stats.totalBooks - stats.borrowedBooks} borrowed={stats.borrowedBooks} />
      </div>
    </div>
  );
}
