import React from 'react'
import Sidebar from './components/SidebarAdmin/SidebarAdmin';
// import Topbar from './components/Topbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Books from './pages/Books/Books';
import BorrowedBooks from './pages/BorrowedBooks/BorrowedBooks';
import ReservedBooks from './pages/ReservedBooks/ReservedBooks';
import Profile from './pages/Profile/Profile';

export default function App() {
    return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="p-4 flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/borrowed" element={<BorrowedBooks />} />
              <Route path="/reservedBooks" element={<ReservedBooks />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );

}
