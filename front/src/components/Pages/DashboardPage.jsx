import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import MemberHeader from "../member_dashboard/MemberHeader";
import MemberStatsCard from "../member_dashboard/MemberStatsCard";
import useDashboardStore from "../../store/useDashboardStore"; // حسب مكان store


const DashboardPage = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Borrowed Books", path: "borrowed" },
    { name: "Reservations", path: "reservations" },
    { name: "Fines", path: "fines" },
    { name: "Profile", path: "profile" },
  ];

  // قراءة القيم من الـ store
  const borrowedBooks = useDashboardStore((state) => state.borrowedBooks.length);
  const fines = useDashboardStore((state) => state.fines.length);
  const reservations = useDashboardStore((state) => state.reservations.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="flex md:flex-col gap-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block py-2 px-4 rounded-md hover:bg-primary/20 transition duration-200 ${
                  location.pathname.includes(item.path) ? "bg-primary/30 font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        <MemberHeader />
        <MemberStatsCard 
          borrowedCount={borrowedBooks}
          finesCount={fines}
          reservationsCount={reservations}
        />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;