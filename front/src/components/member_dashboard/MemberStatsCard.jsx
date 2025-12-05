// src/components/dashboard/MemberStatsCard.jsx
import React from "react";

export default function MemberStatsCard({ borrowedCount, finesCount, reservationsCount }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition duration-300">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Borrowed Books</h2>
        <p className="text-3xl font-bold mt-3 text-primary">{borrowedCount}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition duration-300">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Unpaid Fines</h2>
        <p className="text-3xl font-bold mt-3 text-primary">{finesCount}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition duration-300">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Reservations</h2>
        <p className="text-3xl font-bold mt-3 text-primary">{reservationsCount}</p>
      </div>
    </div>
  );
}