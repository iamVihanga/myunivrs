"use client";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Textarea } from "@repo/ui/components/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AboutUsEditor() {
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/about-us");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setContent(data.content);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/about-us", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save");
      }

      const data = await res.json();
      setContent(data.content);
      toast.success("Content saved successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save content");
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-6 bg-white">
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-cyan-700">
          About Us
        </h2>

        {isEditing ? (
          <>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </>
        ) : (
          <>
            <div className="prose max-w-none">
              {content || <p className="text-gray-500">No content available</p>}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsEditing(true)}>Edit Content</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
