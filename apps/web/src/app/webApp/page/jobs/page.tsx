// webApp/jobs/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react"; // Import useRef
import { Toaster, toast } from "react-hot-toast";

// Import Navbar and Footer components
import Footer from "../../footer/footer"; // Adjust path as needed
import Navbar from "../../navigation/navigation"; // Adjust path as needed

// --- Interfaces for Data (Copied from page.tsx) ---
interface JobData {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  company: string;
  isFeatured: boolean | null;
  requiredSkills: string[];
  salaryRange: {
    min?: number;
    max?: number;
    currency?: string;
  };
  actionUrl: string;
  jobType:
    | "full_time"
    | "part_time"
    | "internship"
    | "contract"
    | "temporary"
    | null;
  cvRequired: boolean;
  status: string;
  // Added for Airbnb-like display:
  postedDate?: string; // e.g., "less than a minute ago" or "2 days ago"
  isFavorite?: boolean; // To simulate favorite status
}

// --- API Fetcher Utility (Copied from page.tsx) ---
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

// --- Reusable Card Component (Adapted for Airbnb-like JobData) ---
interface JobCardProps {
  item: JobData;
}

const JobCard: React.FC<JobCardProps> = ({ item }) => {
  const imageUrl: string =
    item.images && item.images.length > 0 && item.images[0]
      ? item.images[0]
      : "/images/placeholder-job.jpg"; // Specific placeholder for jobs
  const link = item.actionUrl || undefined;

  const CardContent = (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
      {/* Image Container with Aspect Ratio */}
      <div className="relative w-full pb-[100%]">
        {" "}
        {/* pb-[100%] creates a 1:1 aspect ratio */}
        <Image
          src={imageUrl}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="rounded-xl transition-transform duration-300 hover:scale-105"
        />
        {/* Featured Job Badge (similar to Guest Favorite) */}
        {item.isFeatured && (
          <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            Featured Job
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
        <p className="text-gray-500 text-sm line-clamp-1">{item.company}</p>
        <p className="text-gray-500 text-sm">
          {item.jobType
            ? item.jobType
                .replace(/_/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : "Type not specified"}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="font-bold text-gray-900">
            {item.salaryRange?.currency || "LKR"}{" "}
            {item.salaryRange?.min?.toLocaleString()}
            {item.salaryRange?.max
              ? ` - ${item.salaryRange.max.toLocaleString()}`
              : "+"}
          </p>
          {item.postedDate && (
            <div className="text-sm text-gray-700">
              <span>{item.postedDate}</span>
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

export default function JobsPage() {
  const [jobItems, setJobItems] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);

  // Create a ref for the scrollable container
  const featuredJobsScrollRef = useRef<HTMLDivElement>(null);

  // Function to scroll left
  const scrollLeft = () => {
    if (featuredJobsScrollRef.current) {
      featuredJobsScrollRef.current.scrollBy({
        left: -320, // Adjust this value based on card width + gap
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (featuredJobsScrollRef.current) {
      featuredJobsScrollRef.current.scrollBy({
        left: 320, // Adjust this value based on card width + gap
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      try {
        const res = await fetcher<JobData>("/api/jobs");
        // Filter and add mock data for postedDate and isFavorite to match the UI
        const processedData = res.data
          .filter(
            (item) => item.status === "published" || item.status === undefined
          )
          .map((item) => ({
            ...item,
            postedDate: item.postedDate || "less than a minute ago", // Mock posted date
            isFavorite: false, // Default to not favorited
            isFeatured: item.isFeatured || Math.random() > 0.7, // Mock featured status
          }));
        setJobItems(processedData);
      } catch (err: any) {
        toast.error(`Error loading job listings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Featured Jobs Section (Horizontal Scroll) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Featured Jobs
            </h2>
            {/* Navigation arrows with click handlers */}
            <div className="flex space-x-2">
              <button
                className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                onClick={scrollLeft} // Attach scrollLeft function
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
                onClick={scrollRight} // Attach scrollRight function
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
                Loading featured jobs...
              </p>
            </div>
          ) : jobItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">No featured jobs found.</p>
            </div>
          ) : (
            // Horizontal scroll container - attach ref here
            <div
              ref={featuredJobsScrollRef} // Attach the ref
              className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
            >
              {/* Ensure each JobCard has a defined width within the flex container */}
              {jobItems.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[280px] max-w-[320px] flex-shrink-0"
                >
                  <JobCard item={item} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest Listings Section (Grid Layout - unchanged) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Latest Job Listings
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
                Loading latest listings...
              </p>
            </div>
          ) : jobItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">
                No latest job listings found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {jobItems.map((item) => (
                <JobCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
