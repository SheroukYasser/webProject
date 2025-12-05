import React, { useState } from "react";
import useDashboardStore from "../../../store/useDashboardStore";
import ProfileEditForm from "../../member_dashboard/ProfileEditForm";

export default function Profile() {
  const user = useDashboardStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Profile</h1>

      {!isEditing ? (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 max-w-md mx-auto flex flex-col gap-3">
          <p className="text-gray-900 dark:text-white">
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p className="text-gray-900 dark:text-white">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-gray-900 dark:text-white">
            <span className="font-semibold">Phone:</span> {user.phone || "Not set"}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full hover:scale-105 duration-200"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <ProfileEditForm onClose={() => setIsEditing(false)} />
        </div>
      )}
    </div>
  );
}