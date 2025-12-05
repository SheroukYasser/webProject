import React from "react";

export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 hover:scale-105 duration-200">
      <h3 className="text-gray-700 dark:text-gray-300 font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
    </div>
  );
}
