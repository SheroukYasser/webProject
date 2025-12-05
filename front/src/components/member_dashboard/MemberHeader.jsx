import React, { useState, useRef, useEffect } from 'react'; // 💡 استيراد useState, useRef, useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import useDashboardStore from '../../store/useDashboardStore'; 

export default function MemberHeader() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  

  const userName = useDashboardStore((state) => state.user?.name || '');
  const storeLogout = useDashboardStore((state) => state.logout);
  const notifications = useDashboardStore((state) => state.notifications);
  const markAsRead = useDashboardStore((state) => state.markAsRead);

  const unreadCount = notifications.filter(n => !n.read).length;


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    storeLogout(); 
    navigate('/auth'); // بدل '/login'
};

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Welcome back, <span className="text-primary">{userName}</span>!
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="relative p-2 rounded-full text-gray-500 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150"
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white flex items-center justify-center text-xs text-white transform translate-x-1 -translate-y-1">
                {unreadCount}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
              <div className="py-2">
                <p className="px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 border-b pb-2">Notifications ({unreadCount} unread)</p>
                {notifications.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No new notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b cursor-pointer transition duration-150 ${
                        n.read ? 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400' : 'bg-indigo-50 dark:bg-indigo-900 hover:bg-indigo-100 dark:hover:bg-indigo-700 font-medium'
                      }`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <p className="text-sm">{n.message}</p>
                      <p className={`text-xs mt-1 ${n.type === 'warning' ? 'text-red-500' : 'text-gray-400 dark:text-gray-300'}`}>
                        {n.type}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-150"
        >
          Logout
        </button>
      </div>
    </header>
  );
}