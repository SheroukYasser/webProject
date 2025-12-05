import React from "react";
import Book1 from "../../assets/books/book1.jpg";
import Book2 from "../../assets/books/book2.jpg";
import Book3 from "../../assets/books/book3.jpg";
import { useNavigate } from "react-router-dom";


import { FaStar } from "react-icons/fa6";

const BooksData = [
    {
        id: 1,
        img: Book1,
        title: "Who's there",
        rating: 5.0,
        author: "Someone",
    },
    {
        id: 2,
        img: Book2,
        title: "His Life",
        rating: 4.5,
        author: "John",
    },
    {
        id: 3,
        img: Book3,
        title: "Lost boys",
        rating: 4.7,
        author: "Lost Girl",
    },
    {
        id: 4,
        img: Book2,
        title: "His Life",
        rating: 4.4,
        author: "Someone",
    },
    {
        id: 5,
        img: Book1,
        title: "Who's There",
        rating: 4.5,
        author: "Someone",
    },
];



const AllBooks = () => {
    const navigate = useNavigate();
    return (
        <div className="py-10">
            <div className="container">
                {/* header */}
                <div
                    data-aos="slide-up"
                    className="text-center mb-20 max-w-[400px] mx-auto">
                    <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Best Books
                    </p>
                    <h1 className="text-3xl font-bold">Top Books</h1>
                    <p className="text-xs text-gray-400">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa iure,
                        corporis{" "}
                    </p>
                </div>

                {/* books grid */}
                <div 
                    data-aos="slide-up">
                    <div 
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
                    {BooksData.map((data) => (
                        <div key={data.id} className="space-y-3">
                            <img
                                src={data.img}
                                alt=""
                                className="h-[220px] w-[150px] object-cover rounded-md shadow-md"
                            />
                            <div>
                                <h3 className="font-semibold">{data.title}</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-400">
                                    {data.author}
                                </p>
                                <div className="flex items-center gap-1">
                                    <FaStar className="text-yellow-500" />
                                    <span>{data.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                

                {/* button */}
                <div className="flex justify-center ">
                    <button onClick={() => navigate("/books")}
                    
                    className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-full ">
                        View All Books
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AllBooks;