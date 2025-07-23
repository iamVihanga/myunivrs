// // webApp/products/page.tsx
// "use client";

// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import { Toaster, toast } from "react-hot-toast";

// // Import Navbar and Footer components
// import React from "react";
// import Footer from "../../footer/footer"; // Adjust path as needed
// import Navbar from "../../navigation/navigation"; // Adjust path as needed

// // --- Interfaces for Data ---
// interface ProductData {
//   id: string;
//   title: string;
//   description: string | null;
//   images: string[];
//   price: string;
//   discountPercentage: number | null;
//   location: string;
//   condition: "new" | "used" | "refurbished" | null;
//   stockQuantity: string;
//   isNegotiable: boolean;
//   categoryId: string | null;
//   brand: string | null;
//   link: string | null;
//   shipping: string | null;
//   status: string;
//   // Added for Airbnb-like display:
//   rating?: number; // Star rating for products
//   isFavorite?: boolean; // To simulate favorite status
//   isTopPick?: boolean; // For the "Top Pick" badge
// }

// // --- API Fetcher Utility ---
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
//       next: { revalidate: 3600 },
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

// // --- Reusable Card Component ---
// interface ProductCardProps {
//   item: ProductData;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
//   const imageUrl: string =
//     item.images && item.images.length > 0 && typeof item.images[0] === "string"
//       ? item.images[0]
//       : "/images/placeholder-product.jpg"; // Specific placeholder for products
//   const link = item.link || undefined;

//   // Calculate discounted price if applicable
//   const originalPrice = parseFloat(item.price);
//   const discountedPrice = item.discountPercentage
//     ? originalPrice * (1 - item.discountPercentage / 100)
//     : originalPrice;

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
//         {/* Top Pick Badge */}
//         {item.isTopPick && (
//           <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
//             Top Pick
//           </span>
//         )}
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
//           {item.location}
//           {item.condition
//             ? ` · ${item.condition
//                 .replace(/_/g, " ")
//                 .split(" ")
//                 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                 .join(" ")}`
//             : ""}
//         </p>
//         <div className="flex justify-between items-center mt-1">
//           <p className="font-bold text-gray-900">
//             LKR{" "}
//             {discountedPrice.toLocaleString(undefined, {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//             {item.discountPercentage && (
//               <span className="ml-2 text-sm text-gray-500 line-through font-normal">
//                 {originalPrice.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </span>
//             )}
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

// export default function ProductsPage() {
//   const [productItems, setProductItems] = useState<ProductData[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Create a ref for the scrollable container for "Trending Products"
//   const trendingProductsScrollRef = useRef<HTMLDivElement>(null);

//   // Function to scroll left for "Trending Products"
//   const scrollLeftTrending = () => {
//     if (trendingProductsScrollRef.current) {
//       // MODIFIED: Adjusted scroll amount to match new card width + gap
//       const cardWidth = 600; // New desired card width
//       const gap = 24; // space-x-6 is 1.5rem = 24px
//       trendingProductsScrollRef.current.scrollBy({
//         left: -(cardWidth + gap),
//         behavior: "smooth",
//       });
//     }
//   };

//   // Function to scroll right for "Trending Products"
//   const scrollRightTrending = () => {
//     if (trendingProductsScrollRef.current) {
//       // MODIFIED: Adjusted scroll amount to match new card width + gap
//       const cardWidth = 600; // New desired card width
//       const gap = 24; // space-x-6 is 1.5rem = 24px
//       trendingProductsScrollRef.current.scrollBy({
//         left: cardWidth + gap,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     const fetchProductData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetcher<ProductData>("/api/products");
//         // Filter and add mock data for rating, isFavorite, and isTopPick
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
//             isFavorite: false, // Default to not favorited
//             isTopPick: item.isTopPick || Math.random() > 0.7, // Mock top pick status
//           }));
//         setProductItems(processedData);
//       } catch (err: any) {
//         toast.error(`Error loading product listings: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProductData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white">
//       <Toaster position="top-right" reverseOrder={false} />
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         {/* Trending Products Section (Horizontal Scroll) */}
//         <section className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-semibold text-gray-900">
//               Trending Products
//             </h2>
//             {/* Navigation arrows with click handlers */}
//             <div className="flex space-x-2">
//               <button
//                 className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
//                 onClick={scrollLeftTrending}
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
//                 onClick={scrollRightTrending}
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
//                 Loading trending products...
//               </p>
//             </div>
//           ) : productItems.length === 0 ? (
//             <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
//               <p className="text-xl text-gray-600">
//                 No trending products found.
//               </p>
//             </div>
//           ) : (
//             // Horizontal scroll container - attach ref here
//             <div
//               ref={trendingProductsScrollRef} // Attach the ref
//               className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
//             >
//               {/* MODIFIED: Set fixed width for ProductCard wrapper in Trending Products */}
//               {productItems.map(
//                 (
//                   item // Removed .filter((item) => item.isTopPick)
//                 ) => (
//                   <div
//                     key={item.id}
//                     className="w-[500px] flex-shrink-0" // Doubled width
//                   >
//                     <ProductCard item={item} />
//                   </div>
//                 )
//               )}
//             </div>
//           )}
//         </section>

//         {/* New Arrivals Section (Grid Layout) - No changes here as per request */}
//         <section className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-semibold text-gray-900">
//               New Arrivals
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
//                 Loading new arrivals...
//               </p>
//             </div>
//           ) : productItems.length === 0 ? (
//             <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
//               <p className="text-xl text-gray-600">No new arrivals found.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//               {productItems.map((item) => (
//                 <ProductCard key={item.id} item={item} />
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// webApp/products/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

// Import Navbar and Footer components
import React from "react";
import Footer from "../../footer/footer"; // Adjust path as needed
import Navbar from "../../navigation/navigation"; // Adjust path as needed

// --- Interfaces for Data ---
interface ProductData {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  price: string;
  discountPercentage: number | null;
  location: string;
  condition: "new" | "used" | "refurbished" | null;
  stockQuantity: string;
  isNegotiable: boolean;
  categoryId: string | null;
  brand: string | null;
  link: string | null;
  shipping: string | null;
  status: string;
  // Added for Airbnb-like display:
  rating?: number; // Star rating for products
  isFavorite?: boolean; // To simulate favorite status
  isTopPick?: boolean; // For the "Top Pick" badge
}

// --- API Fetcher Utility ---
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
      next: { revalidate: 3600 },
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

// --- Reusable Card Component ---
interface ProductCardProps {
  item: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const imageUrl: string =
    item.images && item.images.length > 0 && typeof item.images[0] === "string"
      ? item.images[0]
      : "/images/placeholder-product.jpg"; // Specific placeholder for products
  const link = item.link || undefined;

  // Calculate discounted price if applicable
  const originalPrice = parseFloat(item.price);
  const discountedPrice = item.discountPercentage
    ? originalPrice * (1 - item.discountPercentage / 100)
    : originalPrice;

  const CardContent = (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
      {/* Image Container with Aspect Ratio */}
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
        {/* Top Pick Badge */}
        {item.isTopPick && (
          <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            Top Pick
          </span>
        )}
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
          {item.location}
          {item.condition
            ? ` · ${item.condition
                .replace(/_/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}`
            : ""}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="font-bold text-gray-900">
            LKR{" "}
            {discountedPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            {item.discountPercentage && (
              <span className="ml-2 text-sm text-gray-500 line-through font-normal">
                {originalPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
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

export default function ProductsPage() {
  const [productItems, setProductItems] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  // Create a ref for the scrollable container for "Trending Products"
  const trendingProductsScrollRef = useRef<HTMLDivElement>(null);

  // Function to scroll left for "Trending Products"
  const scrollLeftTrending = () => {
    if (trendingProductsScrollRef.current) {
      const cardWidth = 500; // Match w-[500px] in the div below
      const gap = 24; // space-x-6 is 1.5rem = 24px
      trendingProductsScrollRef.current.scrollBy({
        left: -(cardWidth + gap),
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right for "Trending Products" with looping
  const scrollRightTrending = () => {
    if (trendingProductsScrollRef.current) {
      const container = trendingProductsScrollRef.current;
      const cardWidth = 500; // Match w-[500px] in the div below
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
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await fetcher<ProductData>("/api/products");
        // Filter and add mock data for rating, isFavorite, and isTopPick
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
            isFavorite: false, // Default to not favorited
            isTopPick: item.isTopPick || Math.random() > 0.7, // Mock top pick status
          }));
        setProductItems(processedData);
      } catch (err: any) {
        toast.error(`Error loading product listings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, []);

  // Auto-scrolling effect for trending products
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!loading && productItems.length > 0) {
      intervalId = setInterval(() => {
        scrollRightTrending();
      }, 2000); // Scroll every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clean up the interval on component unmount
      }
    };
  }, [loading, productItems.length]); // Re-run effect if loading state or item count changes

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Trending Products Section (Horizontal Scroll) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Featured Products
            </h2>
            {/* Navigation arrows with click handlers */}
            <div className="flex space-x-2">
              <button
                className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                onClick={scrollLeftTrending}
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
                onClick={scrollRightTrending}
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
                Loading trending products...
              </p>
            </div>
          ) : productItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">
                No trending products found.
              </p>
            </div>
          ) : (
            // Horizontal scroll container - attach ref here
            <div
              ref={trendingProductsScrollRef} // Attach the ref
              className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide" // 'scrollbar-hide' is already here
            >
              {productItems.map(
                (
                  item // Removed .filter((item) => item.isTopPick)
                ) => (
                  <div
                    key={item.id}
                    className="w-[500px] flex-shrink-0" // Fixed width for ProductCard wrapper
                  >
                    <ProductCard item={item} />
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* New Arrivals Section (Grid Layout) - No changes here as per request */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Latest Products Listing
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
                Loading new arrivals...
              </p>
            </div>
          ) : productItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">No new arrivals found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {productItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
