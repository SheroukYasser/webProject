import React from "react";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaLocationArrow,
    FaMobileAlt,
} from "react-icons/fa";

const FooterLinks = [
    { title: "Home", link: "/#" },
    { title: "About", link: "/#about" },
    { title: "Contact", link: "/#contact" },
    { title: "Blog", link: "/#blog" },
];

const Footer = () => {
    return (
        <div className="bg-white dark:bg-gray-900 dark:text-gray-300">
            <div className="container">
                {/* Top Grid */}
                <div className="grid md:grid-cols-3 py-5">
                    {/* Company Details */}
                    <div className="py-8 px-4">
                        <h1 className="sm:text-3xl text-xl font-bold mb-3 flex items-center gap-3 text-gray-900 dark:text-white">
                            Books Store
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet
                            consectetur adipisicing elit. Possimus, voluptate.
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                            <FaLocationArrow className="dark:text-gray-400" />
                            <p>Noida, Uttar Pradesh</p>
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                            <FaMobileAlt className="dark:text-gray-400" />
                            <p>+91 123456789</p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 mt-6">
                            <a href="#">
                                <FaInstagram className="text-3xl text-gray-700 dark:text-gray-300" />
                            </a>
                            <a href="#">
                                <FaFacebook className="text-3xl text-gray-700 dark:text-gray-300" />
                            </a>
                            <a href="#">
                                <FaLinkedin className="text-3xl text-gray-700 dark:text-gray-300" />
                            </a>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
                        {[1].map((col) => (
                            <div key={col} className="py-8 px-4">
                                <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                    Important Links
                                </h1>
                                <ul className="flex flex-col gap-3">
                                    {FooterLinks.map((data, index) => (
                                        <li
                                            key={index}
                                            className="cursor-pointer hover:translate-x-1 duration-300 hover:text-primary text-gray-600 dark:text-gray-400"
                                        >
                                            <span>&#11162;</span>
                                            <span>{data.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Footer;
