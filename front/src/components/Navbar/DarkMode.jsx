import React, { useState, useEffect } from "react";
import Darkpng from "../../assets/website/dark-mode-button.png";
import Lightpng from "../../assets/website/light-mode-button.png";


const DarkMode = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );
    const element = document.documentElement;

    useEffect(() => {
        if (theme === "dark") {
            element.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            element.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);
    return (
    <>
        <div className="relative ">
            <img
            
            src={Lightpng}
            alt=""
            className={`w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 absolute right-0 z-10 
            ${
            theme === "dark" ? "opacity-0" : "opacity-100"
            } `}
            onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
            }
            
            />
            <img src={Darkpng} alt="dark"
            className="w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 "
            onClick={() =>
            setTheme( theme === "dark" ? "light" : "dark")
            }
            
            />
        </div>
    </>
        );
};

export default DarkMode;
