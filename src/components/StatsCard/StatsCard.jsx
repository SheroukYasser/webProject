import React from 'react';

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <span className="text-gray-500">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
};

export default StatsCard;
