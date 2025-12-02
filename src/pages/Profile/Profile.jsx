// import React, { useEffect, useState } from "react";
// import axios from "axios";

const Profile = () => {
  // Static librarian data
  const librarian = {
    librarian_id: 1,
    full_name: "Rawan Ibrahim",
    email: "rawan@example.com",
    created_at: "2025-01-15T10:30:00Z",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Librarian Profile</h2>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">ID:</span> {librarian.librarian_id}
          </div>
          <div>
            <span className="font-semibold">Full Name:</span> {librarian.full_name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {librarian.email}
          </div>
          <div>
            <span className="font-semibold">Joined:</span>{" "}
            {new Date(librarian.created_at).toLocaleDateString()}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;
