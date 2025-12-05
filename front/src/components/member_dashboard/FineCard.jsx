import React from "react";

export default function FineCard({ fine }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-4 hover:bg-primary hover:text-white duration-300">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Reason:
      </p>
      <p className="mb-2">{fine.reason}</p>

      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Amount:
      </p>
      <p className="text-lg font-bold">${fine.amount}</p>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Status: {fine.paid ? "Paid" : "Unpaid"}
      </p>
    </div>
  );
}