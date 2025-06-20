"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Textarea } from "@repo/ui/components/textarea";
import { useState } from "react";

export default function AboutUsSection() {
  const [content, setContent] = useState(
    "We are a team of passionate developers dedicated to building modern, fast, and user-friendly web applications. Our goal is to simplify digital solutions for businesses and users around the world."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(content);

  const handleSave = () => {
    setContent(tempContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempContent(content);
    setIsEditing(false);
  };

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-6 shadow-md bg-white">
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-cyan-700">
          About Us
        </h2>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              rows={5}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-center">{content}</p>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
