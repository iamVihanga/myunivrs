"use client";

import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast"; // Ensure 'react-hot-toast' is installed: npm install react-hot-toast

// Define the interface for your user profile data
interface UserProfileData {
  id?: string; // Optional for creation, required for update
  userId?: string;
  images?: (string | null)[];
  username: string;
  universityName: string | null;
  studentId: string | null;
  courseOfStudy: string | null;
  yearsOfStudy:
    | "1st Year"
    | "2nd Year"
    | "3rd Year"
    | "4th Year"
    | "5th Year"
    | "Graduated"
    | null;
  interest: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

// Options for the 'Years of Study' select field
const yearsOfStudyOptions = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year", // Added 5th year as a common option
  "Graduated",
];

// PageProps for consistency with your example (though searchParams are not directly used for this specific profile view)
interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default function ProfilePage({ searchParams }: PageProps) {
  // Destructure searchParams for consistency, even if not directly used for a single profile's content
  const { page = "1", search = "" } = searchParams;

  const { data: session, isPending: sessionLoading } = useSession(); // Hook to get user session info
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null); // Stores fetched user profile data
  const [formData, setFormData] = useState<UserProfileData>({
    // Holds data for the form inputs
    username: "",
    universityName: null,
    studentId: null,
    courseOfStudy: null,
    yearsOfStudy: null,
    interest: null,
    images: [],
  });
  const [loading, setLoading] = useState(false); // State for form submission loading
  const [loadingProfile, setLoadingProfile] = useState(true); // State for initial profile fetch loading
  const [error, setError] = useState<string | null>(null); // State for fetch errors
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For displaying selected image

  // Determine if it's a new profile or an existing one being edited/completed
  const isNewProfile = !userProfile?.id;

  // Effect to populate formData and imagePreview once userProfile is fetched
  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
      setImagePreview(userProfile.images?.[0] || null);
    }
  }, [userProfile]);

  // Function to fetch the current user's profile from the backend
  const fetchUserProfile = useCallback(async () => {
    if (sessionLoading || !session?.user?.id) {
      setLoadingProfile(false); // Stop loading if no session or user ID
      return;
    }

    setLoadingProfile(true);
    setError(null);
    try {
      // Assuming your backend route for a single user profile filters by current user's ID
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile?userId=${session.user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Removed Authorization header with token as per previous request
          },
          credentials: "include", // Important for sending cookies if your auth relies on them
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const result = await response.json();
      // Assuming your API returns an array, take the first one if it exists
      if (result.data && result.data.length > 0) {
        setUserProfile(result.data[0]);
      } else {
        setUserProfile(null); // No profile found for this user
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching your profile.");
      console.error("Fetch profile error:", err);
      toast.error("Failed to load profile. Please try again.");
    } finally {
      setLoadingProfile(false);
    }
  }, [session, sessionLoading]);

  // Fetch profile on component mount or when session changes
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handler for input changes in the form
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value, // Convert empty strings to null for backend
    }));
  };

  // Handler for image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // In a real app, you'd upload this file and get a URL. Here, storing base64 for preview.
        setFormData((prev) => ({ ...prev, images: [reader.result as string] }));
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, images: [] }));
    }
  };

  // Handler for form submission (create or update profile)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("You must be logged in to save your profile.");
      return;
    }

    setLoading(true);

    // Prepare data to send: only include fields that were empty or are always required
    const fieldsToUpdate: Partial<UserProfileData> = {
      username: formData.username, // Username is always required/sent
    };

    if (isNewProfile || !userProfile?.universityName) {
      fieldsToUpdate.universityName = formData.universityName;
    }
    if (isNewProfile || !userProfile?.studentId) {
      fieldsToUpdate.studentId = formData.studentId;
    }
    if (isNewProfile || !userProfile?.courseOfStudy) {
      fieldsToUpdate.courseOfStudy = formData.courseOfStudy;
    }
    if (isNewProfile || !userProfile?.yearsOfStudy) {
      fieldsToUpdate.yearsOfStudy = formData.yearsOfStudy;
    }
    if (isNewProfile || !userProfile?.interest) {
      fieldsToUpdate.interest = formData.interest;
    }
    // Only send images if it's a new profile or if the existing profile has no image
    if (isNewProfile || !userProfile?.images?.[0]) {
      fieldsToUpdate.images = formData.images;
    }

    try {
      const url = userProfile?.id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile/${userProfile.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile`;
      const method = userProfile?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldsToUpdate), // Send only relevant fields
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save profile.");
      }

      toast.success(
        `Profile ${isNewProfile ? "created" : "updated"} successfully!`
      );
      fetchUserProfile(); // Re-fetch profile data to update the UI
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic for Loading, Error, or Form ---

  // Show loading state while session is being fetched
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">Loading session...</div>
      </div>
    );
  }

  // Show access denied if no session
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/signin")} // Redirect to sign-in page
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Main page rendering
  return (
    <div className="container mx-auto py-8 px-3 max-w-7xl">
      <Toaster position="top-right" /> {/* To display toasts */}
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Your Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal details and preferences
          </p>
        </div>
        {/* If you wanted additional buttons/actions on the profile header, they'd go here */}
      </div>
      {/* Main Content Area - conditionally show loading, error, or the form */}
      <div className="space-y-6">
        {loadingProfile ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Loading your profile...</p>
          </div>
        ) : error ? (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-sm max-w-lg mx-auto">
            <p className="font-bold text-xl mb-2">Error Loading Profile</p>
            <p className="text-lg">{error}</p>
            <p className="mt-3 text-gray-600">
              Please try refreshing the page.
            </p>
          </div>
        ) : (
          // Profile Form UI
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              {isNewProfile ? "Create Your Profile" : "Complete Your Profile"}
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              {isNewProfile
                ? "Tell us a bit about yourself to enhance your connections."
                : "Fill in the missing details to complete your profile."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Field - Show if new profile or existing has no image */}
              {(isNewProfile || !userProfile?.images?.[0]) && (
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Profile Preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl font-bold">
                        {formData.username
                          ? formData.username.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-image-upload"
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
                  >
                    Upload Image
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    For best results, use a square image (e.g., 200x200px).
                  </p>
                </div>
              )}

              {/* Username Field - Always shown for new profile, or if existing is empty */}
              {(isNewProfile || !userProfile?.username) && (
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Your unique username"
                  />
                </div>
              )}

              {/* University Name Field - Conditionally shown */}
              {(isNewProfile || !userProfile?.universityName) && (
                <div>
                  <label
                    htmlFor="universityName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    University Name
                  </label>
                  <input
                    type="text"
                    id="universityName"
                    name="universityName"
                    value={formData.universityName || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="e.g., University of Sri Jayewardenepura"
                  />
                </div>
              )}

              {/* Student ID Field - Conditionally shown */}
              {(isNewProfile || !userProfile?.studentId) && (
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Your student identification number"
                  />
                </div>
              )}

              {/* Course of Study Field - Conditionally shown */}
              {(isNewProfile || !userProfile?.courseOfStudy) && (
                <div>
                  <label
                    htmlFor="courseOfStudy"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Course of Study
                  </label>
                  <input
                    type="text"
                    id="courseOfStudy"
                    name="courseOfStudy"
                    value={formData.courseOfStudy || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="e.g., Computer Science, Business Analytics"
                  />
                </div>
              )}

              {/* Years of Study Field - Conditionally shown */}
              {(isNewProfile || !userProfile?.yearsOfStudy) && (
                <div>
                  <label
                    htmlFor="yearsOfStudy"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Years of Study
                  </label>
                  <select
                    id="yearsOfStudy"
                    name="yearsOfStudy"
                    value={formData.yearsOfStudy || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 bg-white"
                  >
                    <option value="">Select your year</option>
                    {yearsOfStudyOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Interest Field - Conditionally shown */}
              {(isNewProfile || !userProfile?.interest) && (
                <div>
                  <label
                    htmlFor="interest"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Interests (comma-separated)
                  </label>
                  <textarea
                    id="interest"
                    name="interest"
                    value={formData.interest || ""}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200 resize-y"
                    placeholder="e.g., Programming, Reading, Hiking, Gaming"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-semibold text-white transition-all duration-300 ease-in-out
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
                    }`}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {isNewProfile ? "Create Profile" : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
