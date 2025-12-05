import React from 'react'
import Img1 from "../../assets/books/book2.jpg";
import Img2 from "../../assets/books/book1.jpg";
import Img3 from "../../assets/books/book3.jpg";
import { FaAudioDescription } from 'react-icons/fa6';
import { FaStar } from 'react-icons/fa6';



const BooksData = [
    {
        id: 1,
        img: Img1,
        title: "Who's there",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero odio minus enim sint quia architecto distinctio ",
    },
    {
        id: 2,
        img: Img2,
        title: "His Life",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero odio minus enim sint quia architecto distinctio ",
    },
    {
        id: 3,
        img: Img3,
        title: "Lost boys",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero odio minus enim sint quia architecto distinctio ",
    },
];

const BestBooks = () => {
    return (
        <div>
            <div className="container">
                {/* Title section */}
                <div className="text-center mb-20 max-w-[400px] mx-auto">
                    <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Trending Books
                    </p>
                    <h1 className="text-3xl font-bold">Best Books</h1>
                    <p className="text-xs text-gray-400">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa iure,
                        corporis
                    </p>
                </div>

                {/* Cards section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
                    {BooksData.map((book) => (
                        <div
                            data-aos="zoom-in"
                            className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-primary dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
                        >
                            {/* Image container */}
                            <div className="h-[100px]">
                                <img
                                    src={book.img}
                                    alt=""
                                    className="max-w-[100px] block mx-auto transform -translate-y-14 group-hover:scale-105 duration-300 shadow-md"
                                />
                            </div>

                            {/* Card content */}
                            <div className="p-4 text-center -mt-10">
                                {/* Stars */}
                                <div className="w-full flex items-center justify-center mb-2">
                                    <FaStar className="text-yellow-500" />
                                    <FaStar className="text-yellow-500" />
                                    <FaStar className="text-yellow-500" />
                                    <FaStar className="text-yellow-500" />
                                </div>

                                <h1 className="text-xl font-bold mb-2">{book.title}</h1>

                                <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                                    {book.description}
                                </p>

                                <button 
                                
                                className="bg-primary text-white px-4 py-2 rounded-full mt-4 hover:scale-105 duration-200 group-hover:bg-white group-hover:text-primary">
                                    Borrow Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BestBooks;


