'use client';

import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import "./styles/header.css";
import { ToggleTheme } from "@/components/custom/ToggleTheme";

const navLinks = [
    { href: "/dashboard", label: "首页" },
    { href: "/password/newsee", label: "解密" },
    { href: "#", label: "网站实例" },
    { href: "#", label: "博客" },
    { href: "#", label: "登录页面" },
    { href: "https://github.com/DellDi", label: <i className="fab fa-github"></i> },
];

export default function ClientHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div>
            <header className="flex justify-between items-center p-6">
                <div className="flex items-center">
                    <img src="https://avatars.githubusercontent.com/u/40460351?v=4" alt="Next.js logo" className="h-8"/>
                    <span className="ml-2 text-xl font-bold">Next Node</span>
                    <ToggleTheme className="ml-1"/>
                    <button onClick={toggleDarkMode} className="ml-2 p-2 bg-gray-200 dark:bg-gray-800 rounded">
                        Toggle Mode
                    </button>
                </div>
                <nav className="hidden md:flex space-x-4">
                    {navLinks.map((link, index) => (
                        <a key={index} href={link.href}
                           className="text-gray-600 dark:text-gray-300 hover-underline-animation">
                            {link.label}
                        </a>
                    ))}
                </nav>
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 dark:text-gray-300">
                        {menuOpen ? <Cross1Icon className="h-6 w-6"/> : <HamburgerMenuIcon className="h-6 w-6"/>}
                    </button>
                </div>
                {menuOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-50 top-14">
                        <div
                            className="bg-white dark:bg-gray-900 p-4 shadow-lg transform transition-transform duration-300 ease-in-out w-full">
                            {navLinks.map((link, index) => (
                                <a key={index} href={link.href}
                                   className="block text-gray-600 dark:text-gray-300 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded hover-underline-animation">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}
