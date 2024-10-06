'use client';

import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import "./styles/header.css";
import { ToggleTheme } from "@/components/custom/ToggleTheme";

const navLinks = [
    { href: "#", label: "Next.js 入门" },
    { href: "#", label: "中文文档" },
    { href: "#", label: "网站实例" },
    { href: "#", label: "博客" },
    { href: "#", label: "Nextra" },
    { href: "#", label: "英文官网" },
    { href: "#", label: <i className="fab fa-github"></i> },
];

export default function ClientHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div>
            <header className="flex justify-between items-center p-6">
                <div className="flex items-center">
                    <img src="https://avatars.githubusercontent.com/u/40460351?v=4" alt="Next.js logo" className="h-8"/>
                    <span className="ml-2 text-xl font-bold">Next Node</span>
                    <ToggleTheme className="ml-1"/>
                </div>
                <nav className="hidden md:flex space-x-4">
                    {navLinks.map((link, index) => (
                        <a key={index} href={link.href}
                           className="text-gray-600 dark:text-dark-text hover-underline-animation">
                            {link.label}
                        </a>
                    ))}
                </nav>
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 dark:text-dark-text">
                        {menuOpen ? <Cross1Icon className="h-6 w-6"/> : <HamburgerMenuIcon className="h-6 w-6"/>}
                    </button>
                </div>
                {menuOpen && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-50 top-14">
                        <div
                            className="bg-white dark:bg-dark-bg p-4 shadow-lg transform transition-transform duration-300 ease-in-out w-full">
                            {navLinks.map((link, index) => (
                                <a key={index} href={link.href}
                                   className="block text-gray-600 dark:text-dark-text py-2 hover:bg-gray-200 dark:hover:bg-dark-hover rounded hover-underline-animation">
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
