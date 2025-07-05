"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@repo/ui/components/input";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);

  // Handle debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL with search query
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedQuery) {
      params.set("search", debouncedQuery);
    } else {
      params.delete("search");
    }

    params.set("page", "1"); // Reset to first page on new search
    router.push(`?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  return (
    <div className="relative flex w-full max-w-md items-center">
      <Input
        placeholder="Search listings..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10"
      />
      <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
    </div>
  );
}
