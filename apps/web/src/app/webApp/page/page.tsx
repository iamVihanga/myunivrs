// webApp/page.tsx (or src/app/page.tsx)
"use client"; // This directive is necessary for client-side functionality in App Router

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

// Import Navbar and Footer components
import Footer from "../footer/footer"; // Adjust path if your webApp folder is not the root
import Navbar from "../navigation/navigation"; // Adjust path if your webApp folder is not the root

// --- Interfaces for Data (Assuming your backend schemas) ---

interface HousingData {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  address: string;
  city: string | null;
  price: string;
  bedrooms: number | null;
  bathrooms: number | null;
  contactNumber: string | null;
  housingType: string | null;
  isFurnished: boolean;
  link: string | null;
  status: string;
}

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
}

interface EventData {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  location: string;
  isFeatured: boolean | null;
  eventDate: string; // ISO 8601 string
  status: string;
}

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
}

// Union type for all possible items, with a 'type' discriminator
type ItemType = "housing" | "job" | "event" | "product";

type CombinedItem =
  | (HousingData & { type: "housing" })
  | (JobData & { type: "job" })
  | (EventData & { type: "event" })
  | (ProductData & { type: "product" });

// --- API Fetcher Utility ---
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"; // Added a fallback for dev

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

// --- Reusable Card Component ---
interface CardProps {
  item: CombinedItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0]
      : `/images/placeholder-${item.type}.jpg`;
  const link = (item as any).link || (item as any).actionUrl || undefined;

  const renderSpecificDetails = (item: CombinedItem) => {
    switch (item.type) {
      case "housing":
        return (
          <div className="text-gray-700 text-sm mt-2 space-y-1">
            <p className="font-semibold text-lg text-blue-600">
              LKR {item.price}
            </p>
            <p>
              <strong>Address:</strong> {item.address}, {item.city}
            </p>
            {item.bedrooms && (
              <p>
                <strong>Bedrooms:</strong> {item.bedrooms}
              </p>
            )}
          </div>
        );
      case "job":
        return (
          <div className="text-gray-700 text-sm mt-2 space-y-1">
            <p>
              <strong>Company:</strong> {item.company}
            </p>
            {item.jobType && (
              <p>
                <strong>Job Type:</strong>{" "}
                {item.jobType
                  .replace(/_/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            )}
            {item.salaryRange?.min && (
              <p>
                <strong>Salary:</strong> {item.salaryRange.currency || "LKR"}{" "}
                {item.salaryRange.min.toLocaleString()}
                {item.salaryRange.max
                  ? ` - ${item.salaryRange.max.toLocaleString()}`
                  : ""}
              </p>
            )}
          </div>
        );
      case "event":
        const eventItem = item as EventData;
        return (
          <div className="text-gray-700 text-sm mt-2 space-y-1">
            <p>
              <strong>Location:</strong> {eventItem.location}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(eventItem.eventDate)}
            </p>
          </div>
        );
      case "product":
        return (
          <div className="text-gray-700 text-sm mt-2 space-y-1">
            <p className="font-semibold text-lg text-green-600">
              LKR {item.price}
            </p>
            <p>
              <strong>Condition:</strong>{" "}
              {item.condition
                ?.replace(/_/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
            <p>
              <strong>Location:</strong> {item.location}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const CardContent = (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <Image
          src={imageUrl || "/images/placeholder-generic.jpg"}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
        <span
          className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${
            item.type === "housing"
              ? "bg-blue-500"
              : item.type === "job"
                ? "bg-green-500"
                : item.type === "event"
                  ? "bg-purple-500"
                  : item.type === "product"
                    ? "bg-orange-500"
                    : "bg-gray-500"
          }`}
        >
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </span>
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {item.description}
            </p>
          )}
        </div>
        {renderSpecificDetails(item)}
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

// Helper for date formatting
const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    return dateString;
  }
};

// --- Main Page Component ---
export default function Home() {
  const [allItems, setAllItems] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed filter state and FilterButton component as filtering is now handled by dedicated pages

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [housingRes, jobsRes, eventsRes, productsRes] = await Promise.all(
          [
            fetcher<HousingData>("/api/housing"),
            fetcher<JobData>("/api/jobs"),
            fetcher<EventData>("/api/events"),
            fetcher<ProductData>("/api/products"),
          ]
        );

        const combined: CombinedItem[] = [
          ...housingRes.data
            .filter(
              (item) => item.status === "published" || item.status === undefined
            )
            .map((item) => ({ ...item, type: "housing" as const })),
          ...jobsRes.data
            .filter(
              (item) => item.status === "published" || item.status === undefined
            )
            .map((item) => ({ ...item, type: "job" as const })),
          ...eventsRes.data
            .filter(
              (item) => item.status === "published" || item.status === undefined
            )
            .map((item) => ({ ...item, type: "event" as const })),
          ...productsRes.data
            .filter(
              (item) => item.status === "published" || item.status === undefined
            )
            .map((item) => ({ ...item, type: "product" as const })),
        ];

        setAllItems(combined);
      } catch (err: any) {
        toast.error(`Error loading items: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Display all items on the homepage without specific filtering
  const displayedItems = useMemo(() => {
    return allItems;
  }, [allItems]);

  return (
    <div id="top" className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Use the imported Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* --- Hero Section --- */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-xl mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
            Welcome to Myunivrs
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up">
            Your ultimate university platform for everything you need.
          </p>
          <div className="space-x-4 animate-fade-in">
            <Link
              href="#listings"
              className="px-8 py-4 bg-white text-blue-700 font-bold rounded-full text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Explore Listings
            </Link>
          </div>
        </section>
        {/* --- Unified Listings Gallery Section --- */}
        <section
          id="listings"
          className="py-12 bg-white rounded-lg shadow-lg mb-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Recent Listings
          </h2>

          {/* Filtering options are now handled by navigation links */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-lg text-gray-700">Loading listings...</p>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">
                No listings found at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
              {displayedItems.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
        {/* --- About Us Section (remains separate) --- */}
        <section id="about" className="py-12 bg-white rounded-lg shadow-lg">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            About Myunivrs
          </h2>
          <div className="p-8 md:p-12 lg:p-16">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Welcome to **Myunivrs** – your vibrant digital hub designed
              exclusively for university students! We understand the unique
              challenges and opportunities that come with student life, and our
              mission is to create a seamless, supportive, and resourceful
              community for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-200 pb-3">
                  Our Vision
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our vision is to empower university students by providing a
                  centralized platform where they can easily access essential
                  services, connect with peers, and enhance their academic and
                  personal lives. We aim to be the go-to resource that
                  simplifies student living, making it more convenient and
                  rewarding.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We believe in fostering a strong university community where
                  every student feels supported and can thrive.
                </p>
              </div>
              <div className="relative h-64 md:h-auto min-h-[250px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/about-vision.jpg"
                  alt="Myunivrs Vision"
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="relative h-64 md:h-auto min-h-[250px] rounded-lg overflow-hidden shadow-lg order-2 md:order-1">
                <Image
                  src="/images/about-mission.jpg"
                  alt="Myunivrs Mission"
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <h3 className="text-3xl font-bold text-gray-900 border-b-2 border-blue-200 pb-3">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Myunivrs is dedicated to simplifying student life by offering
                  comprehensive resources across various essential categories:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    <strong className="font-semibold text-blue-600">
                      Housing:
                    </strong>{" "}
                    Connecting students with verified and suitable accommodation
                    options.
                  </li>
                  <li>
                    <strong className="font-semibold text-blue-600">
                      Jobs:
                    </strong>{" "}
                    Providing a platform for part-time jobs, internships, and
                    career opportunities.
                  </li>
                  <li>
                    <strong className="font-semibold text-blue-600">
                      Events:
                    </strong>{" "}
                    Keeping you informed about campus activities, workshops, and
                    social gatherings.
                  </li>
                  <li>
                    <strong className="font-semibold text-blue-600">
                      Products:
                    </strong>{" "}
                    Facilitating a marketplace for buying and selling student
                    essentials, from textbooks to electronics.
                  </li>
                </ul>
              </div>
            </div>

            <section className="text-center py-10 bg-blue-50 rounded-lg shadow-inner">
              <h3 className="text-3xl font-bold text-blue-800 mb-4">
                Why Choose Myunivrs?
              </h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                We are committed to providing a secure, user-friendly, and
                highly relevant experience for every student. With Myunivrs, you
                spend less time searching and more time experiencing university
                life to the fullest.
              </p>
            </section>

            <section className="text-center mt-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                Have questions, suggestions, or just want to say hello? We'd
                love to hear from you!
              </p>
              <a
                href="mailto:info@myunivrs.com"
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </a>
            </section>
          </div>
        </section>
      </main>

      {/* Use the imported Footer */}
      <Footer />
    </div>
  );
}
