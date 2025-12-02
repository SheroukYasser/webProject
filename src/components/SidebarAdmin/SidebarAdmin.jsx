import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarAdmin = () => {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Books', path: '/books' },
    { name: 'Borrowed Books', path: '/borrowed' },
    { name: 'Reserved Books', path: '/reservedBooks' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`p-2 rounded hover:bg-gray-200 ${
              location.pathname === link.path ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SidebarAdmin;

