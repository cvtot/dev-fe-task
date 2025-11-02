'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { PaginationProps } from '@/types';

export default function Pagination({ currentPage, totalPages, userId }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    
    if (userId) {
      params.set('userId', userId.toString());
    } else {
      params.delete('userId');
    }
    
    router.push(`/posts?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always include last page (if more than 1 page)
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots where there are gaps
    let prev = 0;
    for (const page of range) {
      if (page - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (page - prev > 2) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination" aria-label="Pagination Navigation">
      {/* Previous Button */}
      <button
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-secondary"
        aria-label="Go to previous page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => navigate(pageNum)}
            className={`btn ${isActive ? 'active' : 'btn-secondary'}`}
            aria-label={`Go to page ${pageNum}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-secondary"
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}
