"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@repo/ui/components/pagination";

interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function PostPagination({
  currentPage,
  totalPages
}: PostPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  // Create page items array
  const getPageItems = () => {
    // Always show first page, last page, current page, and pages around current
    const pageItems: (number | "ellipsis")[] = [];

    // Always add page 1
    pageItems.push(1);

    // If current page is more than 3, add ellipsis after page 1
    if (currentPage > 3) {
      pageItems.push("ellipsis");
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pageItems.push(i);
      }
    }

    // If current page is less than totalPages - 2, add ellipsis before last page
    if (currentPage < totalPages - 2) {
      pageItems.push("ellipsis");
    }

    // Always add last page if it's not the same as first page
    if (totalPages > 1) {
      pageItems.push(totalPages);
    }

    return pageItems;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "opacity-50 pointer-events-none" : ""
            }
          />
        </PaginationItem>

        {/* Page numbers */}
        {getPageItems().map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={createPageURL(item)}
                isActive={item === currentPage}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
