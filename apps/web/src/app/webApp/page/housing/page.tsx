// // webApp/housing/page.tsx
// "use client";

// import Image from "next/image";
// import { useEffect, useRef, useState } from "react"; // Import useRef for scrolling
// import { Toaster, toast } from "react-hot-toast";

// // Import Navbar and Footer components
// import React from "react";
// import Footer from "../../footer/footer"; // Adjust path as needed
// import Navbar from "../../navigation/navigation"; // Adjust path as needed

// // --- Interfaces for Data ---
// interface HousingData {
//   id: string;
//   title: string;
//   description: string | null;
//   images: string[];
//   address: string;
//   city: string | null;
//   price: string; // Assuming this is the price for the listing
//   bedrooms: number | null;
//   bathrooms: number | null;
//   contactNumber: string | null;
//   housingType: string | null;
//   isFurnished: boolean;
//   link: string | null;
//   status: string;
//   // Added for Airbnb-like display:
//   nights?: number; // Number of nights for the price, e.g., "2 nights"
//   rating?: number; // Star rating
//   isFavorite?: boolean; // To simulate favorite status
// }

// // --- API Fetcher Utility ---
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"; // Use default for development if env var not set

// interface ApiResponse<T> {
//   data: T[];
//   meta: {
//     currentPage: number;
//     totalPages: number;
//     totalCount: number;
//     limit: number;
//   };
// }

// async function fetcher<T>(endpoint: string): Promise<ApiResponse<T>> {
//   try {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       credentials: "include",
//       next: { revalidate: 3600 }, // Revalidate data every hour
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         errorData.message ||
//           `Failed to fetch from ${endpoint}: ${response.statusText}`
//       );
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching data from ${endpoint}:`, error);
//     throw error;
//   }
// }

// // --- Reusable Card Component (Adapted for Airbnb-like HousingData) ---
// interface HousingCardProps {
//   item: HousingData;
// }

// const HousingCard: React.FC<HousingCardProps> = ({ item }) => {
//   const imageUrl: string =
//     item.images && item.images.length > 0 && typeof item.images[0] === "string"
//       ? item.images[0]
//       : "/images/placeholder-housing.jpg"; // Specific placeholder for housing
//   const link = item.link || undefined;

//   const CardContent = (
//     <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
//       {/* Image Container with Aspect Ratio */}
//       {/* MODIFIED: Changed pb-[100%] to pb-[42.85%] for a shorter, wider image aspect ratio (approx 21:9) */}
//       <div className="relative w-full pb-[42.85%]">
//         {" "}
//         {/* pb-[42.85%] creates an approximately 21:9 aspect ratio */}
//         <Image
//           src={imageUrl}
//           alt={item.title}
//           layout="fill"
//           objectFit="cover"
//           className="rounded-xl transition-transform duration-300 hover:scale-105"
//         />
//         {/* Guest Favorite Badge - always present as per original code */}
//         <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
//           Guest favorite
//         </span>
//         {/* Heart Icon for Favorite */}
//         <button
//           className="absolute top-3 right-3 p-2 rounded-full bg-transparent hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
//           aria-label="Add to favorites"
//         >
//           <svg
//             className="w-6 h-6 text-white drop-shadow-md"
//             fill={item.isFavorite ? "currentColor" : "none"}
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//             ></path>
//           </svg>
//         </button>
//       </div>

//       {/* Content Area */}
//       <div className="p-3">
//         <h3 className="font-semibold text-gray-900 line-clamp-1">
//           {item.title}
//         </h3>
//         <p className="text-gray-500 text-sm line-clamp-1">
//           {item.address}
//           {item.city ? `, ${item.city}` : ""}
//         </p>
//         <p className="text-gray-500 text-sm">
//           {item.nights ? `${item.nights} nights` : "Nights not specified"}
//         </p>
//         <div className="flex justify-between items-center mt-1">
//           <p className="font-bold text-gray-900">
//             Rs.{item.price}
//             {item.nights ? "" : " /night"}
//           </p>
//           {item.rating !== undefined && (
//             <div className="flex items-center text-sm text-gray-700">
//               <svg
//                 className="w-4 h-4 text-gray-800 mr-1"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.532 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.777.565-1.832-.197-1.532-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
//               </svg>
//               <span>{item.rating.toFixed(2)}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   if (link) {
//     return (
//       <a
//         href={link}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="block h-full"
//       >
//         {CardContent}
//       </a>
//     );
//   }

//   return <div className="h-full">{CardContent}</div>;
// };

// export default function HousingPage() {
//   const [housingItems, setHousingItems] = useState<HousingData[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Create a ref for the scrollable container for "Popular homes"
//   const popularHomesScrollRef = useRef<HTMLDivElement>(null);

//   // Function to scroll left for "Popular homes"
//   const scrollLeftPopular = () => {
//     if (popularHomesScrollRef.current) {
//       // MODIFIED: Adjusted scroll amount to match new card width + gap
//       const cardWidth = 600; // New desired card width
//       const gap = 24; // space-x-6 is 1.5rem = 24px
//       popularHomesScrollRef.current.scrollBy({
//         left: -(cardWidth + gap),
//         behavior: "smooth",
//       });
//     }
//   };

//   // Function to scroll right for "Popular homes"
//   const scrollRightPopular = () => {
//     if (popularHomesScrollRef.current) {
//       // MODIFIED: Adjusted scroll amount to match new card width + gap
//       const cardWidth = 600; // New desired card width
//       const gap = 24; // space-x-6 is 1.5rem = 24px
//       popularHomesScrollRef.current.scrollBy({
//         left: cardWidth + gap,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     const fetchHousingData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetcher<HousingData>("/api/housing");
//         // Filter and add mock data for rating, nights, and isFavorite to match the UI
//         const processedData = res.data
//           .filter(
//             (item) => item.status === "published" || item.status === undefined
//           )
//           .map((item) => ({
//             ...item,
//             rating:
//               item.rating !== undefined
//                 ? item.rating
//                 : parseFloat((Math.random() * (5 - 3) + 3).toFixed(2)), // Random rating between 3 and 5 if not provided
//             nights:
//               item.nights !== undefined
//                 ? item.nights
//                 : Math.floor(Math.random() * 5) + 1, // Random nights between 1 and 5 if not provided
//             isFavorite: false, // Default to not favorited, implement logic to change this
//           }));
//         setHousingItems(processedData);
//       } catch (err: any) {
//         toast.error(`Error loading housing listings: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHousingData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white">
//       {" "}
//       {/* Changed background to white to match Airbnb */}
//       <Toaster position="top-right" reverseOrder={false} />
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         {/* Placeholder for Search Bar if you want to add it here later */}
//         {/*
//         <div className="mb-8 p-4 border border-gray-300 rounded-full shadow-md flex justify-around items-center">
//             <input type="text" placeholder="Where" className="focus:outline-none w-full px-2 py-1" />
//             <span className="text-gray-400">|</span>
//             <input type="text" placeholder="Check in" className="focus:outline-none w-full px-2 py-1" />
//             <span className="text-gray-400">|</span>
//             <input type="text" placeholder="Check out" className="focus:outline-none w-full px-2 py-1" />
//             <span className="text-gray-400">|</span>
//             <input type="text" placeholder="Who" className="focus:outline-none w-full px-2 py-1" />
//             <button className="bg-red-500 text-white p-2 rounded-full">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
//             </button>
//         </div>
//         */}

//         {/* Popular Homes Section (Horizontal Scroll) */}
//         <section className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-semibold text-gray-900">
//               Popular homes in Kuala Lumpur
//             </h2>
//             {/* Navigation arrows with click handlers */}
//             <div className="flex space-x-2">
//               <button
//                 className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
//                 onClick={scrollLeftPopular}
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M15 19l-7-7 7-7"
//                   ></path>
//                 </svg>
//               </button>
//               <button
//                 className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
//                 onClick={scrollRightPopular}
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M9 5l7 7-7 7"
//                   ></path>
//                 </svg>
//               </button>
//             </div>
//           </div>
//           {loading ? (
//             <div className="flex justify-center items-center h-48">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               <p className="ml-4 text-lg text-gray-700">
//                 Loading popular listings...
//               </p>
//             </div>
//           ) : housingItems.length === 0 ? (
//             <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
//               <p className="text-xl text-gray-600">
//                 No popular listings found.
//               </p>
//             </div>
//           ) : (
//             // Horizontal scroll container - attach ref here
//             <div
//               ref={popularHomesScrollRef} // Attach the ref
//               className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide" // Added scrollbar-hide
//             >
//               {/* MODIFIED: Set fixed width for HousingCard wrapper in Popular Homes */}
//               {housingItems.slice(0, 10).map(
//                 // Example: showing first 10 items for "Popular"
//                 (item) => (
//                   <div
//                     key={item.id}
//                     className="w-[500px] flex-shrink-0" // Doubled width
//                   >
//                     <HousingCard item={item} />
//                   </div>
//                 )
//               )}
//             </div>
//           )}
//         </section>

//         {/* Available next month section (Grid Layout - unchanged from your original request) */}
//         <section className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-semibold text-gray-900">
//               Available next month in Melbourne
//             </h2>
//             <button className="text-gray-600 hover:text-gray-900">
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 5l7 7-7 7"
//                 ></path>
//               </svg>
//             </button>
//           </div>
//           {loading ? (
//             <div className="flex justify-center items-center h-48">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               <p className="ml-4 text-lg text-gray-700">
//                 Loading next month's listings...
//               </p>
//             </div>
//           ) : housingItems.length === 0 ? (
//             <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
//               <p className="text-xl text-gray-600">
//                 No listings for next month found.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//               {/* Take a different slice or filtered data for "Next Month" section */}
//               {housingItems.slice(5, 15).map(
//                 // Example: showing items 5 through 14
//                 (item) => (
//                   <HousingCard key={item.id} item={item} />
//                 )
//               )}
//             </div>
//           )}
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// webApp/housing/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react"; // Import useRef for scrolling
import { Toaster, toast } from "react-hot-toast";

// Import Navbar and Footer components
import React from "react";
import Footer from "../../footer/footer"; // Adjust path as needed
import Navbar from "../../navigation/navigation"; // Adjust path as needed

// --- Interfaces for Data ---
interface HousingData {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  address: string;
  city: string | null;
  price: string; // Assuming this is the price for the listing
  bedrooms: number | null;
  bathrooms: number | null;
  contactNumber: string | null;
  housingType: string | null;
  isFurnished: boolean;
  link: string | null;
  status: string;
  // Added for Airbnb-like display:
  nights?: number; // Number of nights for the price, e.g., "2 nights"
  rating?: number; // Star rating
  isFavorite?: boolean; // To simulate favorite status
}

// --- API Fetcher Utility ---
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"; // Use default for development if env var not set

interface ApiResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

async function fetcher<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      next: { revalidate: 3600 }, // Revalidate data every hour
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to fetch from ${endpoint}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

// --- Reusable Card Component (Adapted for Airbnb-like HousingData) ---
interface HousingCardProps {
  item: HousingData;
}

const HousingCard: React.FC<HousingCardProps> = ({ item }) => {
  const imageUrl: string =
    item.images && item.images.length > 0 && typeof item.images[0] === "string"
      ? item.images[0]
      : "/images/placeholder-housing.jpg"; // Specific placeholder for housing
  const link = item.link || undefined;

  const CardContent = (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
      {/* Image Container with Aspect Ratio */}
      {/* MODIFIED: Changed pb-[100%] to pb-[42.85%] for a shorter, wider image aspect ratio (approx 21:9) */}
      <div className="relative w-full pb-[42.85%]">
        {" "}
        {/* pb-[42.85%] creates an approximately 21:9 aspect ratio */}
        <Image
          src={imageUrl}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="rounded-xl transition-transform duration-300 hover:scale-105"
        />
        {/* Guest Favorite Badge - always present as per original code */}
        <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          Guest favorite
        </span>
        {/* Heart Icon for Favorite */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-transparent hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Add to favorites"
        >
          <svg
            className="w-6 h-6 text-white drop-shadow-md"
            fill={item.isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-1">
          {item.address}
          {item.city ? `, ${item.city}` : ""}
        </p>
        <p className="text-gray-500 text-sm">
          {item.nights ? `${item.nights} nights` : "Nights not specified"}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="font-bold text-gray-900">
            Rs.{item.price}
            {item.nights ? "" : " /night"}
          </p>
          {item.rating !== undefined && (
            <div className="flex items-center text-sm text-gray-700">
              <svg
                className="w-4 h-4 text-gray-800 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.532 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.777.565-1.832-.197-1.532-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
              </svg>
              <span>{item.rating.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {CardContent}
      </a>
    );
  }

  return <div className="h-full">{CardContent}</div>;
};

export default function HousingPage() {
  const [housingItems, setHousingItems] = useState<HousingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Create a ref for the scrollable container for "Popular homes"
  const popularHomesScrollRef = useRef<HTMLDivElement>(null);

  // Function to scroll left for "Popular homes"
  const scrollLeftPopular = () => {
    if (popularHomesScrollRef.current) {
      // MODIFIED: Adjusted cardWidth to 500px to match the w-[500px] class
      const cardWidth = 500;
      const gap = 24; // space-x-6 is 1.5rem = 24px
      popularHomesScrollRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right for "Popular homes"
  const scrollRightPopular = () => {
    if (popularHomesScrollRef.current) {
      const container = popularHomesScrollRef.current;
      // MODIFIED: Adjusted cardWidth to 500px to match the w-[500px] class
      const cardWidth = 500;
      const gap = 24; // space-x-6 is 1.5rem = 24px
      const scrollAmount = cardWidth + gap;

      // Check if we are at or near the end of the scroll
      const isAtEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 1; // -1 for a small buffer

      if (isAtEnd) {
        // Jump back to the beginning if at the end
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        // Otherwise, scroll normally
        container.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const fetchHousingData = async () => {
      setLoading(true);
      try {
        const res = await fetcher<HousingData>("/api/housing");
        // Filter and add mock data for rating, nights, and isFavorite to match the UI
        const processedData = res.data
          .filter(
            (item) => item.status === "published" || item.status === undefined
          )
          .map((item) => ({
            ...item,
            rating:
              item.rating !== undefined
                ? item.rating
                : parseFloat((Math.random() * (5 - 3) + 3).toFixed(2)), // Random rating between 3 and 5 if not provided
            nights:
              item.nights !== undefined
                ? item.nights
                : Math.floor(Math.random() * 5) + 1, // Random nights between 1 and 5 if not provided
            isFavorite: false, // Default to not favorited, implement logic to change this
          }));
        setHousingItems(processedData);
      } catch (err: any) {
        toast.error(`Error loading housing listings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchHousingData();
  }, []);

  // Auto-scrolling effect for popular homes
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!loading && housingItems.length > 0) {
      intervalId = setInterval(() => {
        scrollRightPopular();
      }, 2000); // Scroll every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clean up the interval on component unmount
      }
    };
  }, [loading, housingItems.length]); // Re-run effect if loading state or item count changes

  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Changed background to white to match Airbnb */}
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Placeholder for Search Bar if you want to add it here later */}
        {/*
        <div className="mb-8 p-4 border border-gray-300 rounded-full shadow-md flex justify-around items-center">
            <input type="text" placeholder="Where" className="focus:outline-none w-full px-2 py-1" />
            <span className="text-gray-400">|</span>
            <input type="text" placeholder="Check in" className="focus:outline-none w-full px-2 py-1" />
            <span className="text-gray-400">|</span>
            <input type="text" placeholder="Check out" className="focus:outline-none w-full px-2 py-1" />
            <span className="text-gray-400">|</span>
            <input type="text" placeholder="Who" className="focus:outline-none w-full px-2 py-1" />
            <button className="bg-red-500 text-white p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
        </div>
        */}

        {/* Popular Homes Section (Horizontal Scroll) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Featured Housing
            </h2>
            {/* Navigation arrows with click handlers */}
            <div className="flex space-x-2">
              <button
                className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                onClick={scrollLeftPopular}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                onClick={scrollRightPopular}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-lg text-gray-700">
                Loading popular listings...
              </p>
            </div>
          ) : housingItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">
                No popular listings found.
              </p>
            </div>
          ) : (
            // Horizontal scroll container - attach ref here
            <div
              ref={popularHomesScrollRef} // Attach the ref
              className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide" // Added scrollbar-hide
            >
              {/* MODIFIED: Set fixed width for HousingCard wrapper in Popular Homes */}
              {housingItems.slice(0, 10).map(
                // Example: showing first 10 items for "Popular"
                (item) => (
                  <div
                    key={item.id}
                    className="w-[500px] flex-shrink-0" // Doubled width
                  >
                    <HousingCard item={item} />
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* Available next month section (Grid Layout - unchanged from your original request) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Latest Housing
            </h2>
            <button className="text-gray-600 hover:text-gray-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-lg text-gray-700">
                Loading next month's listings...
              </p>
            </div>
          ) : housingItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">
                No listings for next month found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Take a different slice or filtered data for "Next Month" section */}
              {housingItems.slice(5, 15).map(
                // Example: showing items 5 through 14
                (item) => (
                  <HousingCard key={item.id} item={item} />
                )
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
