// webApp/navigation/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname for active link styling
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get current pathname for active link styling

  // Function to determine if a link is active
  const isActiveLink = (href: string) => {
    // Special handling for the root path '/'
    if (href === "/") {
      return pathname === "/";
    }
    // For other paths, check if the pathname starts with the href
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center h-20">
        {/* Left: Logo - Links to the main page */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            {/* Myunivrs Text Logo */}
            <span className="text-3xl font-extrabold text-gray-900">
              Myunivrs
            </span>{" "}
            {/* Larger, bolder logo */}
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Housing, Jobs, Events, Products) */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Housing Link */}
          <Link
            href="/webApp/page/housing"
            className={`
              relative text-lg font-semibold px-3 py-2 rounded-lg transition-all duration-200
              ${
                isActiveLink("/webApp/page/housing")
                  ? "text-blue-600 bg-blue-50" // Active state: Blue text, light blue background
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }
            `}
          >
            Housing
          </Link>

          {/* Jobs Link */}
          <Link
            href="/webApp/page/jobs"
            className={`
              relative text-lg font-semibold px-3 py-2 rounded-lg transition-all duration-200
              ${
                isActiveLink("/webApp/page/jobs")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }
            `}
          >
            Jobs
          </Link>

          {/* Events Link */}
          <Link
            href="/webApp/page/events"
            className={`
              relative text-lg font-semibold px-3 py-2 rounded-lg transition-all duration-200
              ${
                isActiveLink("/webApp/page/events")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }
            `}
          >
            Events
          </Link>

          {/* Products Link */}
          <Link
            href="/webApp/page/products"
            className={`
              relative text-lg font-semibold px-3 py-2 rounded-lg transition-all duration-200
              ${
                isActiveLink("/webApp/page/products")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }
            `}
          >
            Products
          </Link>
        </div>

        {/* Right: About Us and Account Sections */}
        <div className="flex items-center space-x-4">
          {/* About Us Link */}
          <Link
            href="#about" // Link to the about section on the homepage
            className="hidden md:block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition-colors duration-200"
          >
            About Us
          </Link>

          {/* Account Button/Link - Unified for desktop (My Account) and mobile (Hamburger) */}
          <Link
            href="/account" // Assuming you have an /account page for login/profile etc.
            className="flex items-center space-x-2 border border-gray-300 rounded-full pl-3 pr-2 py-2
                       bg-white hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {/* User Icon (always visible) */}
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span className="hidden md:block font-medium text-gray-800">
              My Account
            </span>
            {/* Hamburger Icon for mobile - now inside the Link but still only for mobile */}
            <svg
              className="h-5 w-5 text-gray-600 md:hidden ml-2" // Added ml-2 for spacing
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={(e) => {
                e.preventDefault(); // Prevent Link navigation if clicking hamburger
                setIsOpen(!isOpen);
              }}
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-gray-50 border-t border-gray-200">
          {" "}
          {/* Light gray background */}
          <Link
            href="/webApp/page/housing"
            className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
            onClick={() => setIsOpen(false)}
          >
            Housing
          </Link>
          <Link
            href="/webApp/page/jobs"
            className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
            onClick={() => setIsOpen(false)}
          >
            Jobs
          </Link>
          <Link
            href="/webApp/page/events"
            className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
            onClick={() => setIsOpen(false)}
          >
            Events
          </Link>
          <Link
            href="/webApp/page/products"
            className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            href="#about"
            className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/account"
            className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
            onClick={() => setIsOpen(false)}
          >
            My Account
          </Link>
        </div>
      )}
    </nav>
  );
}
