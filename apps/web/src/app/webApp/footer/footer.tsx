// webApp/footer/footer.tsx
"use client"; // This directive is necessary for client-side functionality in App Router

import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <Link
              href="#top"
              className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Myunivrs
            </Link>
            <p className="text-sm mt-2 text-gray-400">Your University Hub.</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm">
            <Link
              href="#about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About Us
            </Link>
            <Link
              href="#contact"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="#privacy"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#terms"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {currentYear} Myunivrs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
