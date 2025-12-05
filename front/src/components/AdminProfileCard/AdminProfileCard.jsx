import React, { useState } from "react";

export default function AdminProfileCard({ adminData, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(adminData);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = () => {
    onSave(formData); // send updated data to parent
    setIsEditing(false);
  };

  // Cancel edit
  const handleCancel = () => {
    setFormData(adminData); // reset form data
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-md mx-auto mt-8">
      {!isEditing ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {adminData.name}
          </h2>
          <p className="text-gray-700 dark:text-gray-200 mb-2">
            <strong>Email:</strong> {adminData.email}
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            <strong>Phone:</strong> {adminData.phone}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-4 py-2 rounded-full bg-primary text-white hover:scale-105 duration-200"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Edit Profile
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password || ""}
            onChange={handleChange}
            className="p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-full bg-primary text-white hover:scale-105 duration-200"
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}
