// "use client";

// import { useSession } from "@/lib/auth-client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";

// // Define the interface for your user profile data
// interface UserProfileData {
//   id?: string;
//   userId?: string;
//   images?: string[];
//   username: string;
//   universityName: string | null;
//   studentId: string | null;
//   courseOfStudy: string | null;
//   yearsOfStudy:
//     | "1st Year"
//     | "2nd Year"
//     | "3rd Year"
//     | "4th Year"
//     | "Graduate"
//     | "Postgraduate"
//     | null;
//   interest: string | null;
//   createdAt?: string;
//   updatedAt?: string | null;
// }

// const yearsOfStudyOptions = [
//   "1st Year",
//   "2nd Year",
//   "3rd Year",
//   "4th Year",
//   "Graduate",
//   "Postgraduate",
// ];

// export default function ProfilePage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [profileData, setProfileData] = useState<UserProfileData | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [formData, setFormData] = useState<UserProfileData>({
//     username: "",
//     universityName: null,
//     studentId: null,
//     courseOfStudy: null,
//     yearsOfStudy: null,
//     interest: null,
//     images: [],
//   });
//   const [imageFiles, setImageFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//   // Enhanced fetchProfile function to handle different scenarios
//   const fetchProfile = async () => {
//     if (!session?.user?.id) return;

//     try {
//       setInitialLoading(true);

//       // First try to get all profiles and find the current user's profile
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile`,
//         {
//           credentials: "include",
//         }
//       );

//       if (response.ok) {
//         const listData = await response.json();

//         // Find the profile that belongs to the current user
//         const userProfile = listData.data?.find(
//           (profile: UserProfileData) => profile.userId === session.user.id
//         );

//         if (userProfile) {
//           console.log("Found existing profile:", userProfile);
//           setProfileData(userProfile);
//           setFormData(userProfile);
//           setImagePreviews(userProfile.images || []);
//           setIsEditing(false); // Show profile view mode
//         } else {
//           console.log("No profile found for user");
//           // No profile exists yet - show create mode
//           setProfileData(null);
//           setIsEditing(true);
//         }
//       } else {
//         console.error("Failed to fetch profiles:", response.status);
//         // If we can't fetch profiles, allow user to create one
//         setIsEditing(true);
//       }
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       // On error, allow user to create a profile
//       setIsEditing(true);
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (session?.user?.id) {
//       fetchProfile();
//     }
//   }, [session?.user?.id]);

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value === "" ? null : value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setImageFiles(files);

//     // Create previews
//     const previews: string[] = [];
//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         previews.push(e.target?.result as string);
//         if (previews.length === files.length) {
//           setImagePreviews(previews);
//         }
//       };
//       reader.readAsDataURL(file);
//     });

//     if (files.length === 0) {
//       setImagePreviews(formData.images || []);
//     }
//   };

//   const uploadImages = async (): Promise<string[]> => {
//     if (imageFiles.length === 0) return formData.images || [];

//     const uploadedUrls: string[] = [];

//     for (const file of imageFiles) {
//       const formDataUpload = new FormData();
//       formDataUpload.append("file", file);

//       try {
//         // Replace with your actual image upload endpoint
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`,
//           {
//             method: "POST",
//             body: formDataUpload,
//             credentials: "include",
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           uploadedUrls.push(data.url);
//         } else {
//           // Fallback: use base64 for demo purposes
//           const base64 = await new Promise<string>((resolve) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result as string);
//             reader.readAsDataURL(file);
//           });
//           uploadedUrls.push(base64);
//         }
//       } catch (error) {
//         // Fallback: use base64 for demo purposes
//         const base64 = await new Promise<string>((resolve) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result as string);
//           reader.readAsDataURL(file);
//         });
//         uploadedUrls.push(base64);
//       }
//     }

//     return uploadedUrls;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!session) {
//       toast.error("You must be logged in to save your profile.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Upload images first
//       const imageUrls = await uploadImages();

//       const submitData = {
//         ...formData,
//         images: imageUrls,
//       };

//       // Determine URL and method based on whether profile exists
//       let url: string;
//       let method: string;

//       if (profileData?.id) {
//         // Update existing profile using the profile ID
//         url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile/${profileData.id}`;
//         method = "PUT";
//       } else {
//         // Create new profile
//         url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile`;
//         method = "POST";
//       }

//       console.log("Submitting to:", url, "with method:", method);
//       console.log("Data:", submitData);

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submitData),
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();

//         // Handle specific error cases
//         if (
//           response.status === 422 &&
//           errorData.message === "User already has a profile"
//         ) {
//           // If user already has a profile but we don't have it loaded, fetch it
//           toast.error("Profile already exists. Refreshing...");
//           await fetchProfile();
//           return;
//         }

//         throw new Error(errorData.message || "Failed to save profile.");
//       }

//       const savedData = await response.json();
//       console.log("Profile saved successfully:", savedData);

//       // Update local state with the saved data
//       setProfileData(savedData);
//       setFormData(savedData);
//       setIsEditing(false);
//       setImageFiles([]);
//       setImagePreviews(savedData.images || []);

//       toast.success(
//         `Profile ${profileData?.id ? "updated" : "created"} successfully!`
//       );
//     } catch (error: any) {
//       console.error("Error saving profile:", error);
//       toast.error(error.message || "An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToDashboard = () => {
//     router.push("/dashboard");
//   };

//   // Show loading state while fetching profile
//   if (initialLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">
//             Please log in
//           </h1>
//           <p className="text-gray-600">
//             You need to be logged in to view your profile.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Back Button */}
//         <div className="mb-6">
//           <button
//             onClick={handleBackToDashboard}
//             className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 19l-7-7m0 0l7-7m-7 7h18"
//               />
//             </svg>
//             Back to Dashboard
//           </button>
//         </div>

//         {/* Profile Display */}
//         {!isEditing && profileData && (
//           <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
//             <div className="flex justify-between items-start mb-6">
//               <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Edit Profile
//               </button>
//             </div>

//             <div className="grid md:grid-cols-2 gap-8">
//               {/* Profile Images */}
//               {profileData.images && profileData.images.length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Profile Images
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     {profileData.images
//                       .filter((image) => image && image !== "null") // Filter out null or "null" string values
//                       .map((image, index) => (
//                         <div
//                           key={index}
//                           className="relative w-32 h-32 rounded-lg overflow-hidden"
//                         >
//                           <Image
//                             src={image}
//                             alt={`Profile image ${index + 1}`}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}

//               {/* Profile Information */}
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Personal Information
//                   </h3>
//                   <div className="mt-2 space-y-2">
//                     <p>
//                       <span className="font-medium">Username:</span>{" "}
//                       {profileData.username}
//                     </p>
//                     {profileData.universityName && (
//                       <p>
//                         <span className="font-medium">University:</span>{" "}
//                         {profileData.universityName}
//                       </p>
//                     )}
//                     {profileData.studentId && (
//                       <p>
//                         <span className="font-medium">Student ID:</span>{" "}
//                         {profileData.studentId}
//                       </p>
//                     )}
//                     {profileData.courseOfStudy && (
//                       <p>
//                         <span className="font-medium">Course of Study:</span>{" "}
//                         {profileData.courseOfStudy}
//                       </p>
//                     )}
//                     {profileData.yearsOfStudy && (
//                       <p>
//                         <span className="font-medium">Year of Study:</span>{" "}
//                         {profileData.yearsOfStudy}
//                       </p>
//                     )}
//                     {profileData.interest && (
//                       <p>
//                         <span className="font-medium">Interests:</span>{" "}
//                         {profileData.interest}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Profile Form */}
//         {isEditing && (
//           <div className="bg-white rounded-xl shadow-xl p-8">
//             <div className="flex justify-between items-start mb-6">
//               <h2 className="text-3xl font-bold text-gray-900">
//                 {profileData ? "Edit Profile" : "Create Profile"}
//               </h2>
//               {profileData && (
//                 <button
//                   onClick={() => {
//                     setIsEditing(false);
//                     setFormData(profileData);
//                     setImagePreviews(profileData.images || []);
//                     setImageFiles([]);
//                   }}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Image Upload */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Profile Images
//                 </label>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />

//                 {/* Image Previews */}
//                 {imagePreviews.length > 0 && (
//                   <div className="mt-4 grid grid-cols-3 gap-4">
//                     {imagePreviews
//                       .filter((preview) => preview && preview !== "null")
//                       .map((preview, index) => (
//                         <div
//                           key={index}
//                           className="relative w-24 h-24 rounded-lg overflow-hidden"
//                         >
//                           <Image
//                             src={preview}
//                             alt={`Preview ${index + 1}`}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                       ))}
//                   </div>
//                 )}
//               </div>

//               {/* Username */}
//               <div>
//                 <label
//                   htmlFor="username"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Username <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username || ""}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Your unique username"
//                 />
//               </div>

//               {/* University Name */}
//               <div>
//                 <label
//                   htmlFor="universityName"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   University Name
//                 </label>
//                 <input
//                   type="text"
//                   id="universityName"
//                   name="universityName"
//                   value={formData.universityName || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="e.g., University of Sri Jayewardenepura"
//                 />
//               </div>

//               {/* Student ID */}
//               <div>
//                 <label
//                   htmlFor="studentId"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Student ID
//                 </label>
//                 <input
//                   type="text"
//                   id="studentId"
//                   name="studentId"
//                   value={formData.studentId || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Your student identification number"
//                 />
//               </div>

//               {/* Course of Study */}
//               <div>
//                 <label
//                   htmlFor="courseOfStudy"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Course of Study
//                 </label>
//                 <input
//                   type="text"
//                   id="courseOfStudy"
//                   name="courseOfStudy"
//                   value={formData.courseOfStudy || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="e.g., Computer Science, Business Analytics"
//                 />
//               </div>

//               {/* Years of Study */}
//               <div>
//                 <label
//                   htmlFor="yearsOfStudy"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Year of Study
//                 </label>
//                 <select
//                   id="yearsOfStudy"
//                   name="yearsOfStudy"
//                   value={formData.yearsOfStudy || ""}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
//                 >
//                   <option value="">Select your year</option>
//                   {yearsOfStudyOptions.map((year) => (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Interests */}
//               <div>
//                 <label
//                   htmlFor="interest"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Interests
//                 </label>
//                 <textarea
//                   id="interest"
//                   name="interest"
//                   value={formData.interest || ""}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y"
//                   placeholder="e.g., Programming, Reading, Hiking, Gaming"
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
//                     loading
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
//                   }`}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                           fill="none"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       Saving...
//                     </div>
//                   ) : (
//                     `${profileData ? "Update" : "Create"} Profile`
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* No profile and not editing - this should rarely show now */}
//         {!profileData && !isEditing && !initialLoading && (
//           <div className="bg-white rounded-xl shadow-xl p-8 text-center">
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">
//               No Profile Found
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Create your profile to get started.
//             </p>
//             <button
//               onClick={() => setIsEditing(true)}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Create Profile
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast"; // Added Toaster import

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

  // Enhanced fetchProfile function to handle different scenarios
  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      setInitialLoading(true);

      // First try to get all profiles and find the current user's profile
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const listData = await response.json();

        // Find the profile that belongs to the current user
        const userProfile = listData.data?.find(
          (profile: UserProfileData) => profile.userId === session.user.id
        );

        if (userProfile) {
          console.log("Found existing profile:", userProfile);
          setProfileData(userProfile);
          setFormData(userProfile);
          setImagePreviews(userProfile.images || []);
          setIsEditing(false); // Show profile view mode
        } else {
          console.log("No profile found for user");
          // No profile exists yet - show create mode
          setProfileData(null);
          setIsEditing(true);
          // Set username from session if available for a new profile
          if (session.user.username) {
            setFormData((prev) => ({
              ...prev,
              username: session.user.username,
            }));
          }
        }
      } else {
        console.error("Failed to fetch profiles:", response.status);
        // If we can't fetch profiles, allow user to create one
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // On error, allow user to create a profile
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

    // Create previews
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
        // Replace with your actual image upload endpoint
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
          // Fallback: use base64 for demo purposes
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          uploadedUrls.push(base64);
        }
      } catch (error) {
        // Fallback: use base64 for demo purposes
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
      // Upload images first
      const imageUrls = await uploadImages();

      const submitData = {
        ...formData,
        images: imageUrls,
      };

      // Determine URL and method based on whether profile exists
      let url: string;
      let method: string;

      if (profileData?.id) {
        // Update existing profile using the profile ID
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user-profile/${profileData.id}`;
        method = "PUT";
      } else {
        // Create new profile
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

        // Handle specific error cases
        if (
          response.status === 422 &&
          errorData.message === "User already has a profile"
        ) {
          // If user already has a profile but we don't have it loaded, fetch it
          toast.error("Profile already exists. Refreshing...");
          await fetchProfile();
          return;
        }

        throw new Error(errorData.message || "Failed to save profile.");
      }

      const savedData = await response.json();
      console.log("Profile saved successfully:", savedData);

      // Update local state with the saved data
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

  // --- Render Logic for Loading Session, Access Denied, Initial Profile Load, or Form ---

  // Show loading state while fetching profile
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // Show access denied if no session is active
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-xl shadow-2xl max-w-sm mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Please log in to view or manage your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/signin")} // Redirect to sign-in page
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" /> {/* Component to display toasts */}
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 px-5 py-2 text-gray-700 font-medium rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition-all duration-300"
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 lg:p-12 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-6">
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                My Profile
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Profile Images */}
              {profileData.images && profileData.images.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 border-gray-200">
                    Profile Images
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profileData.images
                      .filter((image) => image && image !== "null")
                      .map((image, index) => (
                        <div
                          key={index}
                          className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md border border-gray-200 group"
                        >
                          <Image
                            src={image}
                            alt={`Profile image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                  No images uploaded yet.
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 border-gray-200">
                  Personal Information
                </h3>
                <div className="space-y-4 text-lg text-gray-700">
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 mr-2">
                      Username:
                    </span>
                    <span className="text-right">{profileData.username}</span>
                  </p>
                  {profileData.universityName && (
                    <p className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 mr-2">
                        University:
                      </span>
                      <span className="text-right">
                        {profileData.universityName}
                      </span>
                    </p>
                  )}
                  {profileData.studentId && (
                    <p className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 mr-2">
                        Student ID:
                      </span>
                      <span className="text-right">
                        {profileData.studentId}
                      </span>
                    </p>
                  )}
                  {profileData.courseOfStudy && (
                    <p className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 mr-2">
                        Course of Study:
                      </span>
                      <span className="text-right">
                        {profileData.courseOfStudy}
                      </span>
                    </p>
                  )}
                  {profileData.yearsOfStudy && (
                    <p className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 mr-2">
                        Year of Study:
                      </span>
                      <span className="text-right">
                        {profileData.yearsOfStudy}
                      </span>
                    </p>
                  )}
                  {profileData.interest && (
                    <p className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 mr-2">
                        Interests:
                      </span>
                      <span className="text-right">{profileData.interest}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form Section */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 lg:p-12 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                {profileData ? "Edit Profile" : "Create Profile"}
              </h2>
              {profileData && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profileData);
                    setImagePreviews(profileData.images || []);
                    setImageFiles([]);
                  }}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Profile Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-base text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer transition-colors duration-200"
                />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviews
                      .filter((preview) => preview && preview !== "null")
                      .map((preview, index) => (
                        <div
                          key={index}
                          className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md border border-gray-200"
                        >
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-lg font-semibold text-gray-800 mb-2"
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
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200"
                  placeholder="Your unique username"
                />
              </div>

              {/* University Name */}
              <div>
                <label
                  htmlFor="universityName"
                  className="block text-lg font-semibold text-gray-800 mb-2"
                >
                  University Name
                </label>
                <input
                  type="text"
                  id="universityName"
                  name="universityName"
                  value={formData.universityName || ""}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200"
                  placeholder="e.g., University of Sri Jayewardenepura"
                />
              </div>

              {/* Student ID */}
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-lg font-semibold text-gray-800 mb-2"
                >
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId || ""}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200"
                  placeholder="Your student identification number"
                />
              </div>

              {/* Course of Study */}
              <div>
                <label
                  htmlFor="courseOfStudy"
                  className="block text-lg font-semibold text-gray-800 mb-2"
                >
                  Course of Study
                </label>
                <input
                  type="text"
                  id="courseOfStudy"
                  name="courseOfStudy"
                  value={formData.courseOfStudy || ""}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200"
                  placeholder="e.g., Computer Science, Business Analytics"
                />
              </div>

              {/* Years of Study */}
              <div>
                <label
                  htmlFor="yearsOfStudy"
                  className="block text-lg font-semibold text-gray-800 mb-2"
                >
                  Year of Study
                </label>
                <select
                  id="yearsOfStudy"
                  name="yearsOfStudy"
                  value={formData.yearsOfStudy || ""}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200 bg-white cursor-pointer"
                >
                  <option value="">Select your year</option>
                  {yearsOfStudyOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interests */}
              <div>
                <label
                  htmlFor="interest"
                  className="block text-lg font-semibold text-gray-800 mb-2"
                >
                  Interests (comma-separated)
                </label>
                <textarea
                  id="interest"
                  name="interest"
                  value={formData.interest || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors duration-200 resize-y"
                  placeholder="e.g., Programming, Reading, Hiking, Gaming"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-xl transform hover:-translate-y-1
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
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
                  {profileData ? "Update Profile" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* No profile and not editing - this should rarely show now but styled just in case */}
        {!profileData && !isEditing && !initialLoading && (
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              No Profile Found
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              It looks like you haven't created your profile yet. Let's get
              started!
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create My Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
