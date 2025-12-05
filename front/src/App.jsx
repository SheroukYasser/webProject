
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { Navbar } from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import BestBooks from "./components/BestBooks/BestBooks";
import Banner from "./components/Banner/Banner";
import AppStoreBanner from "./components/AppStorePanner/AppStoreBanner";
import AllBooks from "./components/AllBooks/AllBooks";
import Testimonial from "./components/Testimonial/Testimonial";

import BooksPage from "./components/Pages/BooksPage"; 

import DashboardPage from "./components/Pages/DashboardPage";
import BorrowedBooks from "./components/Pages/memberDash/BorrowedBooks";
import Reservations from "./components/Pages/memberDash/Reservations";
import Fines from "./components/Pages/memberDash/Fines";
import Profile from "./components/Pages/memberDash/Profile";
import ProfileEditForm from "./components/member_dashboard/ProfileEditForm";
import AuthPage from "./components/Pages/AuthPage";

// Admin Part
import SidebarAdmin from "./components/SidebarAdmin/SidebarAdmin";
import AdminDashboard from "./components/Pages/Dashboard/Dashboard";
import AdminBooks from "./components/Pages/Books/Books";
import AdminBorrowedBooks from "./components/Pages/BorrowedBooks/BorrowedBooks";
import AdminReservedBooks from "./components/Pages/ReservedBooks/ReservedBooks";
import AdminProfile from "./components/Pages/Profile/Profile";
// Added new view of members in the admin dashboard
//  import AdminMembersView from "./components/Pages/MembersAdmin/MembersAdmin";

// Auth Context
import { AuthProvider, useAuth } from "./AuthContext";

import AOS from "aos";
import "aos/dist/aos.css";

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { userType } = useAuth();

  if (!userType) return <Navigate to="/auth" />;
  if (role && userType !== role) return <Navigate to="/" />;

  return children;
};

const App = () => {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, easing: "ease-in-sine", delay: 100 });
    AOS.refresh();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <BestBooks />
                <Banner />
                <AppStoreBanner />
                <AllBooks />
                <Testimonial />
                <Footer />
              </>
            }
          />

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/books" element={<BooksPage />} />


          {/* Member Dashboard */}
          <Route path="/dashboard/*" element={<ProtectedRoute role="member"><DashboardPage /></ProtectedRoute>}>
            <Route index element={<BorrowedBooks />} />
            <Route path="borrowed" element={<BorrowedBooks />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="fines" element={<Fines />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<ProfileEditForm />} />
            {/* <Route path="books" element={<BooksPage />} /> */}
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <div className="flex h-screen bg-gray-100">
                <SidebarAdmin />
                <div className="flex-1 flex flex-col p-4 overflow-auto">
                  <Outlet />
                </div>
              </div>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="borrowed" element={<AdminBorrowedBooks />} />
            <Route path="reservedBooks" element={<AdminReservedBooks />} />
            <Route path="profile" element={<AdminProfile />} />
            {/* Added new view of members in the admin dashboard */}
            {/* <Route path="members" element={<AdminMembersView />} /> */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
