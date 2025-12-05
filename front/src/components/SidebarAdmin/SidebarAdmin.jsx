import { NavLink } from "react-router-dom";

export default function SidebarAdmin() {
  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Books", path: "/admin/books" },
    { name: "Borrowed Books", path: "/admin/borrowed" },
    { name: "Reserved Books", path: "/admin/reservedBooks" },
    { name: "Profile", path: "/admin/profile" },
  ];

  const linkClass = ({ isActive }) =>
    `block py-3 px-4 rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-primary/30 font-semibold text-primary"
        : "text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20"
    }`;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin</h2>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.name}>
            <NavLink to={link.path} className={linkClass}>
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
