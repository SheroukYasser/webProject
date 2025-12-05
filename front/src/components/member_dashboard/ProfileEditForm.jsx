import React, { useState } from "react";
import useDashboardStore from "../../store/useDashboardStore";

export default function ProfileEditForm({ onClose }) {
  const user = useDashboardStore((state) => state.user);
  const updateUser = useDashboardStore((state) => state.updateUser);

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ name, email, phone, password: password || undefined });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Edit Profile
      </h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-primary text-white hover:scale-105 duration-200"
        >
          Save
        </button>
      </div>
    </form>
  );
}