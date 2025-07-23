// webApp/events/page.tsx
"use client"; // <--- IMPORTANT: Keep this directive at the very top

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

// Import Navbar and Footer components
import Footer from "../../footer/footer";
import Navbar from "../../navigation/navigation";

// --- Interfaces for Data ---
interface EventData {
  id: string;
  title: string;
  description: string | null;
  images: string[];
  location: string;
  isFeatured: boolean | null;
  eventDate: string; // ISO 8601 string
  status: string;
  isFavorite?: boolean;
  category?: string;
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

async function fetchEventsData(): Promise<EventData[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      credentials: "include",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to fetch events: ${response.statusText}`
      );
    }

    const apiResponse: ApiResponse<EventData> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error(`Error fetching data from /api/events:`, error);
    throw error;
  }
}

// Helper for date formatting
const formatEventDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(date);
    eventDay.setHours(0, 0, 0, 0);

    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffDays === 1) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffDays > 1 && diffDays <= 7) {
      return `${date.toLocaleDateString("en-US", { weekday: "short" })} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  } catch (e) {
    return dateString;
  }
};

// --- Reusable Card Component ---
interface EventCardProps {
  item: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ item }) => {
  const imageUrl: string =
    item.images && item.images.length > 0 && item.images[0]
      ? item.images[0]
      : "/images/placeholder-event.jpg";

  const CardContent = (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
      <div className="relative w-full pb-[100%]">
        <Image
          src={imageUrl}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="rounded-xl transition-transform duration-300 hover:scale-105"
        />
        {item.isFeatured && ( // This condition still respects `isFeatured` for the badge
          <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            Featured Event
          </span>
        )}
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

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-1">{item.location}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="font-bold text-gray-900">
            {formatEventDate(item.eventDate)}
          </p>
          {item.category && (
            <div className="text-sm text-gray-700">
              <span>{item.category}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <div className="h-full">{CardContent}</div>;
};

// EventsPage component
export default function EventsPage() {
  const [eventItems, setEventItems] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const featuredEventsScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeftFeatured = () => {
    if (featuredEventsScrollRef.current) {
      featuredEventsScrollRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  };

  const scrollRightFeatured = () => {
    if (featuredEventsScrollRef.current) {
      featuredEventsScrollRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEventsData();
        const processedData = data
          .filter(
            (item) => item.status === "published" || item.status === undefined
          )
          .map((item) => ({
            ...item,
            isFavorite: false,
            isFeatured: item.isFeatured || Math.random() > 0.7, // Mock featured status
            category:
              item.category ||
              ["Music", "Sports", "Art", "Food", "Tech", "Community"].sort(
                () => 0.5 - Math.random()
              )[0], // Mock category
          }));
        setEventItems(processedData);
      } catch (err: any) {
        console.error("Failed to load event listings:", err);
        setError(
          err.message || "Failed to load events. Please try again later."
        );
        toast.error(`Error loading event listings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // --- MODIFICATION START ---
  // To display all event cards in both sections, simply assign eventItems to both.
  // This means the "Upcoming Events" section will also show past events,
  // which might make the title slightly misleading, but fulfills the request.
  const allEvents = eventItems; // Get all events after initial processing

  const upcomingEvents = allEvents; // Now contains ALL fetched events
  const featuredEvents = allEvents; // Now also contains ALL fetched events
  // --- MODIFICATION END ---

  // Centralized error display
  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center">
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Error Loading Events
          </h2>
          <p className="text-lg text-gray-700">{error}</p>
          <p className="text-md text-gray-500 mt-2">
            Please try refreshing the page or check your backend server.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Featured Events Section (Horizontal Scroll) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Featured Events
            </h2>
            <div className="flex space-x-2">
              <button
                className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                onClick={scrollLeftFeatured}
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
                onClick={scrollRightFeatured}
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
                Loading featured events...
              </p>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">No featured events found.</p>
            </div>
          ) : (
            <div
              ref={featuredEventsScrollRef}
              className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
            >
              {featuredEvents.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[280px] max-w-[320px] flex-shrink-0"
                >
                  <EventCard item={item} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest Listings Section (Grid Layout) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Upcoming Events
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
                Loading upcoming events...
              </p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center p-8 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-xl text-gray-600">No upcoming events found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {upcomingEvents.map((item) => (
                <EventCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
