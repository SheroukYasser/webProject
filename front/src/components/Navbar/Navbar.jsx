// import React from 'react'
// import { Link } from "react-router-dom";
// import Logo from "../../assets/website/logo.png";
// import { FaCaretDown } from "react-icons/fa6";
// import DarkMode from "./DarkMode";
// import { useAuth } from "../../AuthContext";

// const Menu = [
//     { id: 1, name: "Home", link: "/" },
//     { id: 2, name: "Best Seller", link: "/#services" },
//     { id: 3, name: "Dashboard", link: "/dashboard" }, // الرابط الجديد
// ];

// const DropdownLinks = [
//     { name: "Trending Books", link: "/#" },
//     { name: "Best Selling", link: "/#" },
//     { name: "Authors", link: "/#" },
// ];

// export const Navbar = () => {
//     const { userType } = useAuth(); // null لو مش عامل login
//     const isLoggedIn = !!userType;
//     return (
//         <div className="shadow-lg bg-white dark:bg-gray-900 dark:text-white duration-200">
//             <div className="container py-3 sm:py-0">
//                 <div className="flex justify-between items-center">

//                     {/* Logo */}
//                     <div>
//                         <Link
//                             to="/"
//                             className="font-bold text-2xl sm:text-3xl flex gap-2"
//                         >
//                             <img src={Logo} alt="" className="w-10" />
//                             Books
//                         </Link>
//                     </div>

//                     {/* Right Section */}
//                     <div className="flex justify-between items-center gap-4">
//                         <DarkMode />

//                         {/* Menu Items */}
//                         <ul className="hidden sm:flex items-center gap-4">
//                             {Menu.map((menu) => (
//                                 <li key={menu.id}>
//                                     <Link
//                                         to={menu.link}
//                                         className="inline-block py-4 px-4 hover:text-primary duration-200"
//                                     >
//                                         {menu.name}
//                                     </Link>
//                                 </li>
//                             ))}

//                             {/* Dropdown */}
//                             <li className="group relative cursor-pointer">
//                                 <a
//                                     href="/#"
//                                     className="flex h-[72px] items-center gap-[2px]"
//                                 >
//                                     Quick Links
//                                     <FaCaretDown className="transition duration-300 group-hover:rotate-180" />
//                                 </a>

//                                 <div className="absolute -left-9 z-[10] hidden w-[150px] bg-white p-2 text-black group-hover:block">
//                                     <ul>
//                                         {DropdownLinks.map((data, index) => (
//                                             <li key={index}>
//                                                 <a
//                                                     className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
//                                                     href={data.link}
//                                                 >
//                                                     {data.name}
//                                                 </a>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </li>
//                         </ul>

//                         {/* REGISTER BUTTON */}
//                         {!isLoggedIn && (
//                             <Link
//                             to="/auth"
//                             className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3"
//                             >
//                                 Register
//                                 </Link>
//                             )}


//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React from 'react'
import { Link, useNavigate } from "react-router-dom"; 
import Logo from "../../assets/website/logo.png";
import { FaCaretDown } from "react-icons/fa6";
import DarkMode from "./DarkMode";


import { useAuth } from "../../AuthContext"; //AuthContext page

const Menu = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Best Seller", link: "/#services" },
    { id: 3, name: "Dashboard", link: "/dashboard" }, 
];

const DropdownLinks = [
    { name: "Trending Books", link: "/#" },
    { name: "Best Selling", link: "/#" },
    { name: "Authors", link: "/#" },
];

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/"); //return home page after logout
    };

    return (
        <div className="shadow-lg bg-white dark:bg-gray-900 dark:text-white duration-200">
            <div className="container py-3 sm:py-0">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div>
                        <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
                            <img src={Logo} alt="" className="w-10" />
                            Books
                        </Link>
                    </div>

                    {/* Right Section */}
                    <div className="flex justify-between items-center gap-4">
                        <DarkMode />

                        {/* Menu Items */}
                        <ul className="hidden sm:flex items-center gap-4">
                            {Menu.map((menu) => (
                                <li key={menu.id}>
                                    <Link
                                        to={menu.link}
                                        className="inline-block py-4 px-4 hover:text-primary duration-200"
                                    >
                                        {menu.name}
                                    </Link>
                                </li>
                            ))}

                            {/* Dropdown */}
                            <li className="group relative cursor-pointer">
                                <a href="/#" className="flex h-[72px] items-center gap-[2px]">
                                    Quick Links
                                    <FaCaretDown className="transition duration-300 group-hover:rotate-180" />
                                </a>
                                <div className="absolute -left-9 z-[10] hidden w-[150px] bg-white p-2 text-black group-hover:block shadow-md">
                                    <ul>
                                        {DropdownLinks.map((data, index) => (
                                            <li key={index}>
                                                <a className="inline-block w-full rounded-md p-2 hover:bg-primary/20" href={data.link}>
                                                    {data.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        </ul>

                        {/* 3. شرط ظهور الزر (Logic Toggle) */}
                        {user ? (
                            // لو فيه يوزر -> اعرض زر Logout
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold hidden md:block">Hi, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 hover:scale-105 duration-200 text-white py-1 px-4 rounded-full"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            // لو مفيش يوزر -> اعرض زر Register
                            <Link
                                to="/auth"
                                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3"
                            >
                                Register
                            </Link>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}