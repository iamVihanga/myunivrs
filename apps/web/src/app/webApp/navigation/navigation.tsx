// // webApp/navigation/navigation.tsx
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation"; // Import usePathname for active link styling
// import React, { useState } from "react";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname(); // Get current pathname for active link styling

//   // Function to determine if a link is active
//   const isActiveLink = (href: string) => {
//     // Special handling for the root path '/'
//     if (href === "/") {
//       return pathname === "/";
//     }
//     // For other paths, check if the pathname starts with the href
//     return pathname.startsWith(href);
//   };

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center h-20">
//         {/* Left: Logo - Links to the main page */}
//         <div className="flex-shrink-0">
//           <Link href="/" className="flex items-center space-x-2">
//             {/* Myunivrs Text Logo */}
//             <span className="text-3xl font-extrabold text-gray-900">
//               Myunivrs
//             </span>{" "}
//             {/* Larger, bolder logo */}
//           </Link>
//         </div>

//         {/* Center: Desktop Navigation Links (Housing, Jobs, Events, Products) */}
//         <div className="hidden md:flex items-center space-x-8">
//           {/* Housing Link */}
//           <Link
//             href="/webApp/page/housing"
//             className={`
//               relative text-lg font-semibold px-3 py-2 rounded-lg transition-all duration-200
//               ${
//                 isActiveLink("/webApp/page/housing")
//                   ? "text-blue-600 bg-blue-50" // Active state: Blue text, light blue background
//                   : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//               }
//             `}
//           >
//             Housing
//           </Link>

//           {/* Jobs Link */}
//           <Link
//             href="/webApp/page/jobs"
//             className={`
//               relative text-lg font-semibold px-3 py-2 rounded-lg transition-all duration-200
//               ${
//                 isActiveLink("/webApp/page/jobs")
//                   ? "text-blue-600 bg-blue-50"
//                   : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//               }
//             `}
//           >
//             Jobs
//           </Link>

//           {/* Events Link */}
//           <Link
//             href="/webApp/page/events"
//             className={`
//               relative text-lg font-semibold px-3 py-2 rounded-lg transition-all duration-200
//               ${
//                 isActiveLink("/webApp/page/events")
//                   ? "text-blue-600 bg-blue-50"
//                   : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//               }
//             `}
//           >
//             Events
//           </Link>

//           {/* Products Link */}
//           <Link
//             href="/webApp/page/products"
//             className={`
//               relative text-lg font-semibold px-3 py-2 rounded-lg transition-all duration-200
//               ${
//                 isActiveLink("/webApp/page/products")
//                   ? "text-blue-600 bg-blue-50"
//                   : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//               }
//             `}
//           >
//             Products
//           </Link>
//         </div>

//         {/* Right: About Us and Account Sections */}
//         <div className="flex items-center space-x-4">
//           {/* About Us Link */}
//           <Link
//             href="#about" // Link to the about section on the homepage
//             className="hidden md:block text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition-colors duration-200"
//           >
//             About Us
//           </Link>

//           {/* Account Button/Link - Unified for desktop (My Account) and mobile (Hamburger) */}
//           <Link
//             href="/account" // Assuming you have an /account page for login/profile etc.
//             className="flex items-center space-x-2 border border-gray-300 rounded-full pl-3 pr-2 py-2
//                        bg-white hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
//           >
//             {/* User Icon (always visible) */}
//             <svg
//               className="h-5 w-5 text-gray-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//               ></path>
//             </svg>
//             <span className="hidden md:block font-medium text-gray-800">
//               My Account
//             </span>
//             {/* Hamburger Icon for mobile - now inside the Link but still only for mobile */}
//             <svg
//               className="h-5 w-5 text-gray-600 md:hidden ml-2" // Added ml-2 for spacing
//               fill="none"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               onClick={(e) => {
//                 e.preventDefault(); // Prevent Link navigation if clicking hamburger
//                 setIsOpen(!isOpen);
//               }}
//             >
//               <path d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </Link>
//         </div>
//       </div>

//       {/* Mobile Menu (conditionally rendered) */}
//       {isOpen && (
//         <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-gray-50 border-t border-gray-200">
//           {" "}
//           {/* Light gray background */}
//           <Link
//             href="/webApp/page/housing"
//             className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
//             onClick={() => setIsOpen(false)}
//           >
//             Housing
//           </Link>
//           <Link
//             href="/webApp/page/jobs"
//             className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
//             onClick={() => setIsOpen(false)}
//           >
//             Jobs
//           </Link>
//           <Link
//             href="/webApp/page/events"
//             className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
//             onClick={() => setIsOpen(false)}
//           >
//             Events
//           </Link>
//           <Link
//             href="/webApp/page/products"
//             className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
//             onClick={() => setIsOpen(false)}
//           >
//             Products
//           </Link>
//           <Link
//             href="#about"
//             className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
//             onClick={() => setIsOpen(false)}
//           >
//             About Us
//           </Link>
//           <Link
//             href="/account"
//             className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors duration-200 font-medium py-2 px-3"
//             onClick={() => setIsOpen(false)}
//           >
//             My Account
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/webApp/page" className="flex items-center">
              <svg
                className="w-8 h-8 text-cyan-500 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 9.55 9.45 10 10 10V16L8 18V22H16V18L14 16V10C14.55 10 15 9.55 15 9Z" />
              </svg>
              <span className="text-2xl font-bold text-cyan-500">myunivrs</span>
            </Link>
          </div>

          {/* Center: Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <Link
                href="/connection"
                className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActiveLink("/connection")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Connection
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>

              <Link
                href="/webApp/page/housing"
                className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActiveLink("/webApp/page/housing")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Housing
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <Link
                href="/webApp/page/jobs"
                className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActiveLink("/webApp/page/jobs")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Jobs
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <Link
                href="/webApp/page/events"
                className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActiveLink("/webApp/page/events")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Events
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <Link
                href="/webApp/page/products"
                className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActiveLink("/webApp/page/products")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Products
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <Link
                href="/post"
                className={`px-6 py-3 text-sm font-medium rounded-full transition-colors duration-200 ${
                  isActiveLink("/forum")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Forum
              </Link>
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center space-x-4">
            {/* About Us - hidden on mobile */}
            <Link
              href="#about"
              className="hidden lg:block text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
            >
              About Us
            </Link>

            {/* User Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow duration-200 bg-white"
              >
                {/* Hamburger Menu */}
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* User Avatar */}
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/dashboard/housing"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    My Account
                  </Link>

                  {/* Mobile Navigation Links */}
                  <div className="lg:hidden border-t border-gray-200 mt-2 pt-2">
                    <Link
                      href="/webApp/page/housing"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Housing
                    </Link>
                    <Link
                      href="/webApp/page/jobs"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Jobs
                    </Link>
                    <Link
                      href="/webApp/page/events"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Events
                    </Link>
                    <Link
                      href="/webApp/page/products"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Products
                    </Link>

                    <Link
                      href="/webApp/page/products"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Forum
                    </Link>

                    <Link
                      href="#about"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      About Us
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      Sign up
                    </button>
                    <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                      Log in
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
