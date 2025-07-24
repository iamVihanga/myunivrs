"use client";

import GalleryView from "@/modules/media/components/gallery-view"; // Adjust path if needed
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Role = "user" | "b2b";

export default function UserSetupPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [role, setRole] = useState<Role | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use gallery modal for image selection
  const handleGallerySelect = (selectedFiles: { url: string }[]) => {
    setImages(selectedFiles.map((f) => f.url));
    setGalleryOpen(false);
  };

  const handleImageRemove = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selected: Role) => {
    setRole(selected);
    setForm({});
    setImages([]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res: Response;
      if (role === "user") {
        res = await fetch("http://localhost:8000/api/user-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            images: images.length ? images : [],
            username: form.username || null,
            universityName: form.universityName ? form.universityName : null,
            studentId: form.studentId ? form.studentId : null,
            courseOfStudy: form.courseOfStudy ? form.courseOfStudy : null,
            yearsOfStudy: form.yearsOfStudy ? form.yearsOfStudy : null,
            interest: form.interest ? form.interest : null,
          }),
        });
      } else if (role === "b2b") {
        res = await fetch("http://localhost:8000/api/b2b-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            images: images.length ? images : [],
            username: form.username || null,
            businessName: form.businessName ? form.businessName : null,
            businessType: form.businessType ? form.businessType : null,
            contactPerson: form.contactPerson ? form.contactPerson : null,
            phoneNumber: form.phoneNumber ? form.phoneNumber : null,
            address: form.address ? form.address : null,
            subscriptionPlan: form.subscriptionPlan
              ? form.subscriptionPlan
              : null,
            planExpiryDate: form.planExpiryDate ? form.planExpiryDate : null,
            verified: form.verified === "true",
          }),
        });
      }

      if (!res || !res.ok) {
        throw new Error("Failed to save profile. Please try again.");
      }

      if (role === "user") {
        router.push("/webApp/page");
      } else if (role === "b2b") {
        router.push("/dashboard/housing");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Set Up Your Profile
      </h1>

      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

      {!role && (
        <div className="flex flex-col gap-4">
          <button
            className="py-3 px-6 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => handleRoleSelect("user")}
          >
            I am a User (Student)
          </button>
          <button
            className="py-3 px-6 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
            onClick={() => handleRoleSelect("b2b")}
          >
            I am a B2B User (Business)
          </button>
        </div>
      )}

      {(role === "user" || role === "b2b") && (
        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Image Upload using Gallery */}
          <label className="flex flex-col items-start gap-2">
            <span className="font-medium">Profile Images</span>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`uploaded-${idx}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => handleImageRemove(idx)}
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-blue-400 rounded hover:bg-blue-50 transition"
                aria-label="Add image"
              >
                +
              </button>
            </div>
            <GalleryView
              modal={true}
              activeTab="library"
              onUseSelected={handleGallerySelect}
              modalOpen={galleryOpen}
              setModalOpen={setGalleryOpen}
            />
          </label>

          {/* Common fields */}
          <input
            name="username"
            placeholder="Username"
            required
            className="border rounded px-3 py-2"
            value={form.username || ""}
            onChange={handleChange}
          />

          {/* User-specific fields */}
          {role === "user" && (
            <>
              <input
                name="universityName"
                placeholder="University Name"
                className="border rounded px-3 py-2"
                value={form.universityName || ""}
                onChange={handleChange}
              />
              <input
                name="studentId"
                placeholder="Student ID"
                className="border rounded px-3 py-2"
                value={form.studentId || ""}
                onChange={handleChange}
              />
              <input
                name="courseOfStudy"
                placeholder="Course of Study"
                className="border rounded px-3 py-2"
                value={form.courseOfStudy || ""}
                onChange={handleChange}
              />
              <select
                name="yearsOfStudy"
                className="border rounded px-3 py-2"
                value={form.yearsOfStudy || ""}
                onChange={handleChange}
              >
                <option value="">Select Year of Study</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
              <input
                name="interest"
                placeholder="Interests / Hobbies"
                className="border rounded px-3 py-2"
                value={form.interest || ""}
                onChange={handleChange}
              />
            </>
          )}

          {/* B2B-specific fields */}
          {role === "b2b" && (
            <>
              <input
                name="businessName"
                placeholder="Business Name"
                className="border rounded px-3 py-2"
                value={form.businessName || ""}
                onChange={handleChange}
              />
              <input
                name="businessType"
                placeholder="Business Type (e.g. Restaurant, Retail)"
                className="border rounded px-3 py-2"
                value={form.businessType || ""}
                onChange={handleChange}
              />
              <input
                name="contactPerson"
                placeholder="Contact Person"
                className="border rounded px-3 py-2"
                value={form.contactPerson || ""}
                onChange={handleChange}
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                className="border rounded px-3 py-2"
                value={form.phoneNumber || ""}
                onChange={handleChange}
              />
              <input
                name="address"
                placeholder="Address"
                className="border rounded px-3 py-2"
                value={form.address || ""}
                onChange={handleChange}
              />
              <select
                name="subscriptionPlan"
                className="border rounded px-3 py-2"
                value={form.subscriptionPlan || ""}
                onChange={handleChange}
              >
                <option value="">Select Subscription Plan</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <input
                name="planExpiryDate"
                type="date"
                className="border rounded px-3 py-2"
                value={form.planExpiryDate || ""}
                onChange={handleChange}
              />
              <label className="flex items-center gap-2">
                <input
                  name="verified"
                  type="checkbox"
                  checked={form.verified === "true"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      verified: e.target.checked ? "true" : "false",
                    })
                  }
                />
                Verified
              </label>
            </>
          )}

          <button
            type="submit"
            className={`py-2 px-4 rounded font-semibold ${
              role === "user"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : role === "user"
                ? "Submit User Profile"
                : "Submit B2B Profile"}
          </button>
        </form>
      )}

      {role && (
        <button
          className="mt-6 text-sm text-gray-500 underline"
          onClick={() => handleRoleSelect(null)}
          disabled={loading}
        >
          &larr; Back to role selection
        </button>
      )}
    </div>
  );
}
