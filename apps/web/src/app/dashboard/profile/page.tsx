"use client";

import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

// Define the interface for your user profile data
interface UserProfileData {
  id?: string;
  userId?: string;
  images?: string[];
  username: string;
  universityName: string | null;
  studentId: string | null;
  courseOfStudy: string | null;
  yearsOfStudy:
    | "1st Year"
    | "2nd Year"
    | "3rd Year"
    | "4th Year"
    | "Graduate"
    | "Postgraduate"
    | null;
  interest: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

const yearsOfStudyOptions = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Graduate",
  "Postgraduate",
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  // Image popup state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const [formData, setFormData] = useState<UserProfileData>({
    username: "",
    universityName: null,
    studentId: null,
    courseOfStudy: null,
    yearsOfStudy: null,
    interest: null,
    images: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      setInitialLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const listData = await response.json();
        const userProfile = listData.data?.find(
          (profile: UserProfileData) => profile.userId === session.user.id
        );

        if (userProfile) {
          console.log("Found existing profile:", userProfile);
          setProfileData(userProfile);
          setFormData(userProfile);
          setImagePreviews(userProfile.images || []);
          setIsEditing(false);
        } else {
          console.log("No profile found for user");
          setProfileData(null);
          setIsEditing(true);
          if (session.user.name) {
            setFormData((prev) => ({
              ...prev,
              username: session.user.name,
            }));
          }
        }
      } else {
        console.error("Failed to fetch profiles:", response.status);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsEditing(true);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  // Handle image popup
  const openImagePopup = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!profileData?.images) return;

    const validImages = profileData.images.filter(
      (img) => img && img !== "null"
    );
    let newIndex = selectedImageIndex;

    if (direction === "next") {
      newIndex = (selectedImageIndex + 1) % validImages.length;
    } else {
      newIndex =
        selectedImageIndex === 0
          ? validImages.length - 1
          : selectedImageIndex - 1;
    }

    setSelectedImageIndex(newIndex);
    setSelectedImage(validImages[newIndex] ?? null);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage) {
        switch (e.key) {
          case "Escape":
            closeImagePopup();
            break;
          case "ArrowLeft":
            navigateImage("prev");
            break;
          case "ArrowRight":
            navigateImage("next");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImage, selectedImageIndex]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    const previews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });

    if (files.length === 0) {
      setImagePreviews(formData.images || []);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return formData.images || [];

    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`,
          {
            method: "POST",
            body: formDataUpload,
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          uploadedUrls.push(base64);
        }
      } catch (error) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        uploadedUrls.push(base64);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("You must be logged in to save your profile.");
      return;
    }

    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      const submitData = {
        ...formData,
        images: imageUrls,
      };

      let url: string;
      let method: string;

      if (profileData?.id) {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile/${profileData.id}`;
        method = "PUT";
      } else {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile`;
        method = "POST";
      }

      console.log("Submitting to:", url, "with method:", method);
      console.log("Data:", submitData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (
          response.status === 422 &&
          errorData.message === "User already has a profile"
        ) {
          toast.error("Profile already exists. Refreshing...");
          await fetchProfile();
          return;
        }
        throw new Error(errorData.message || "Failed to save profile.");
      }

      const savedData = await response.json();
      console.log("Profile saved successfully:", savedData);

      setProfileData(savedData);
      setFormData(savedData);
      setIsEditing(false);
      setImageFiles([]);
      setImagePreviews(savedData.images || []);

      toast.success(
        `Profile ${profileData?.id ? "updated" : "created"} successfully!`
      );
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-2xl shadow-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Fetching your profile details...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-xs mx-auto transform transition-all duration-500 hover:scale-105">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
            Access Denied
          </h2>
          <p className="text-base text-gray-700 mb-6">
            Please log in to view or manage your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/signin")}
            className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-base"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-4 lg:px-6">
      <Toaster position="top-right" />

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeImagePopup}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation arrows */}
            {profileData?.images &&
              profileData.images.filter((img) => img && img !== "null").length >
                1 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className="absolute left-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigateImage("next")}
                    className="absolute right-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

            {/* Image counter */}
            {profileData?.images &&
              profileData.images.filter((img) => img && img !== "null").length >
                1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                  {selectedImageIndex + 1} /{" "}
                  {
                    profileData.images.filter((img) => img && img !== "null")
                      .length
                  }
                </div>
              )}

            {/* Main image */}
            <div className="relative w-full h-full max-w-3xl max-h-[80vh] mx-auto">
              <Image
                src={selectedImage}
                alt={`Profile image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeImagePopup}
          ></div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-3xl p-6 md:p-8 border border-gray-200">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 px-5 py-2 text-base font-medium rounded-full bg-gray-700 text-white shadow-md hover:shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:-translate-x-0.5 border border-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Profile Display Section */}
        {!isEditing && profileData && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4 gap-4 border-b-2 pb-4 border-gray-200">
              <h1 className="text-4xl font-extrabold text-gray-800 leading-tight text-center md:text-left">
                Your Profile
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="px-7 py-3 bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-base"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Profile Images */}
              {profileData.images && profileData.images.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800 border-b-2 pb-3 border-gray-300">
                    My Photos
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profileData.images
                      .filter((image) => image && image !== "null")
                      .map((image, index) => (
                        <div
                          key={index}
                          className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md border border-gray-200 group transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                          onClick={() => openImagePopup(image, index)}
                        >
                          <Image
                            src={image}
                            alt={`Profile image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Click to view
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-full min-h-[160px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-gray-700 text-base font-medium p-4 text-center">
                  <svg
                    className="w-12 h-12 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>No dazzling images uploaded yet!</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Click "Edit Profile" to add some.
                  </p>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 border-b-2 pb-3 border-gray-300">
                  About Me
                </h3>
                <div className="space-y-4 text-base text-gray-700">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                    <span className="font-semibold text-gray-900 mr-2">
                      Username:
                    </span>
                    <span className="text-right font-medium text-gray-800">
                      {profileData.username}
                    </span>
                  </div>
                  {profileData.universityName && (
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                      <span className="font-semibold text-gray-900 mr-2">
                        University:
                      </span>
                      <span className="text-right font-medium text-gray-800">
                        {profileData.universityName}
                      </span>
                    </div>
                  )}
                  {profileData.studentId && (
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                      <span className="font-semibold text-gray-900 mr-2">
                        Student ID:
                      </span>
                      <span className="text-right font-medium text-gray-800">
                        {profileData.studentId}
                      </span>
                    </div>
                  )}
                  {profileData.courseOfStudy && (
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                      <span className="font-semibold text-gray-900 mr-2">
                        Course of Study:
                      </span>
                      <span className="text-right font-medium text-gray-800">
                        {profileData.courseOfStudy}
                      </span>
                    </div>
                  )}
                  {profileData.yearsOfStudy && (
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                      <span className="font-semibold text-gray-900 mr-2">
                        Year of Study:
                      </span>
                      <span className="text-right font-medium text-gray-800">
                        {profileData.yearsOfStudy}
                      </span>
                    </div>
                  )}
                  {profileData.interest && (
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                      <span className="font-semibold text-gray-900 mr-2">
                        Interests:
                      </span>
                      <span className="text-right font-medium text-gray-800">
                        {profileData.interest}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form Section */}
        {isEditing && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3 border-b-2 pb-4 border-gray-200">
              <h2 className="text-3xl font-extrabold text-gray-800 leading-tight">
                {profileData ? "Edit Your Profile" : "Create Your Profile"}
              </h2>
              {profileData && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profileData);
                    setImagePreviews(profileData.images || []);
                    setImageFiles([]);
                  }}
                  className="px-6 py-2 bg-gray-400 text-gray-800 font-semibold rounded-full hover:bg-gray-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-2">
                  Profile Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg"
                />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviews
                      .filter((preview) => preview && preview !== "null")
                      .map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                          onClick={() => openImagePopup(preview, index)}
                        >
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-lg font-bold text-gray-800 mb-2"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 text-base transition-all duration-200 placeholder-gray-400 focus:shadow-md"
                  placeholder="Your unique username"
                />
              </div>

              {/* University Name */}
              <div>
                <label
                  htmlFor="universityName"
                  className="block text-lg font-bold text-gray-800 mb-2"
                >
                  University Name
                </label>
                <input
                  type="text"
                  id="universityName"
                  name="universityName"
                  value={formData.universityName || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 text-base transition-all duration-200 placeholder-gray-400 focus:shadow-md"
                  placeholder="e.g., University of Sri Jayewardenepura"
                />
              </div>

              {/* Student ID */}
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-lg font-bold text-gray-800 mb-2"
                >
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 text-base transition-all duration-200 placeholder-gray-400 focus:shadow-md"
                  placeholder="Your student identification number"
                />
              </div>

              {/* Course of Study */}
              <div>
                <label
                  htmlFor="courseOfStudy"
                  className="block text-lg font-bold text-gray-800 mb-2"
                >
                  Course of Study
                </label>
                <input
                  type="text"
                  id="courseOfStudy"
                  name="courseOfStudy"
                  value={formData.courseOfStudy || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 text-base transition-all duration-200 placeholder-gray-400 focus:shadow-md"
                  placeholder="e.g., Computer Science, Business Analytics"
                />
              </div>

              {/* Years of Study */}
              <div>
                <label
                  htmlFor="yearsOfStudy"
                  className="block text-lg font-bold text-gray-800 mb-2"
                >
                  Year of Study
                </label>
                <div className="relative">
                  <select
                    id="yearsOfStudy"
                    name="yearsOfStudy"
                    value={formData.yearsOfStudy || ""}
                    onChange={handleInputChange}
                    className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 text-base transition-all duration-200 bg-white cursor-pointer focus:shadow-md"
                  >
                    <option value="">Select your year</option>
                    {yearsOfStudyOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9l4.95 4.95z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <label
                  htmlFor="interest"
                  className="block text-lg font-bold text-gray-800 mb-2"
                >
                  Interests (comma-separated)
                </label>
                <textarea
                  id="interest"
                  name="interest"
                  value={formData.interest || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 text-base transition-all duration-200 resize-y placeholder-gray-400 focus:shadow-md"
                  placeholder="e.g., Programming, Reading, Hiking, Gaming"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg transform hover:-translate-y-0.5
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2"
                    }`}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-6 w-6 text-white"
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
                  {profileData ? "Update My Profile" : "Create My Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* No profile and not editing */}
        {!profileData && !isEditing && !initialLoading && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-200 max-w-sm mx-auto transform transition-all duration-500 hover:scale-[1.01]">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
              Profile Not Found
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              It seems you haven't set up your profile yet. Let's create one and
              get you connected!
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base"
            >
              Create My Profile Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
