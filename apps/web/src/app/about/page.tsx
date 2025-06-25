"use client";
import dynamic from "next/dynamic";

const AboutUsEditor = dynamic(() => import("@/components/dashboard/about"), {
  ssr: false,
});

export default function AboutPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {" "}
        {/* Container for better width control */}
        <AboutUsEditor />
      </div>
    </main>
  );
}
