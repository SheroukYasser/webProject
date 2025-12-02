import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BooksChart = ({ available, borrowed }) => {
  const data = {
    labels: ["Available", "Borrowed"],
    datasets: [
      {
        label: "Books",
        data: [available, borrowed],
        backgroundColor: ["#3b82f6", "#ef4444"], // blue, red
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow h-64">
      <Bar data={data} />
    </div>
  );
};

export default BooksChart;
