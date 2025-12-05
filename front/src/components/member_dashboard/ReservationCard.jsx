import React from "react";

export default function ReservationCard({ reservation, onCancel }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 flex flex-col justify-between gap-4 max-w-sm mx-auto">
      <div>
        <p className="font-semibold text-gray-900 dark:text-white mb-1">
          Title: <span className="font-normal">{reservation.title}</span>
        </p>
        <p className="font-semibold text-gray-900 dark:text-white">
          Reserved Date: <span className="text-green-500">{reservation.reservedDate}</span>
        </p>
      </div>

      <button
        onClick={onCancel}
        className="mt-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full hover:scale-105 duration-200"
      >
        Cancel
      </button>
    </div>
  );
}