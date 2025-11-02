'use client';

import { useState, useMemo, useEffect } from 'react';
import BlogCard from './BlogCard';
import SearchBar from '@/components/ui/SearchBar';
import type { BlogPost, BlogListProps } from '@/types';

export default function BlogList({ initialPosts }: BlogListProps) {
  const [displayedCount, setDisplayedCount] = useState(9);
  const [searchQuery, setSearchQuery] = useState('');

  // Console log data in browser console
  useEffect(() => {
    console.log('📋 Blog List - Initial Posts Data:', initialPosts);
    console.log('📊 Blog List - Total Posts:', initialPosts.length);
    console.log('📊 Blog List - First Post:', initialPosts[0]);
    console.log('📊 Blog List - All Posts:', initialPosts);
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return initialPosts;

    const query = searchQuery.toLowerCase();
    return initialPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query)
    );
  }, [initialPosts, searchQuery]);

  const displayedPosts = filteredPosts.slice(0, displayedCount);
  const hasMore = displayedCount < filteredPosts.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 9);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setDisplayedCount(9); // Reset to first page when searching
  };

  return (
    <>
      {/* Search bar */}
      <div className="bg-[#F9F5FF] pb-16">
        <SearchBar onSearchChange={handleSearchChange} />
      </div>

      {/* Blog grid with background image - 100vw */}
      <div
        className="relative overflow-hidden p-8 md:p-12 mb-16 min-h-[400px]"
        style={{
          width: '100vw',
          backgroundImage:
            displayedPosts.length > 0
              ? 'url(/images/blog-background.svg)'
              : 'none',
          backgroundSize: 'contain',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Grid container */}
        {displayedPosts.length > 0 ? (
          <div
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8  mx-auto lg:px-[4.5rem]"
            style={{
              width: '100%',
            }}
          >
            {displayedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="relative text-center py-24 container mx-auto px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              No posts found
            </p>
            <p className="text-sm text-gray-500">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>

      {/* Load More button */}
      {hasMore && (
        <div className="flex justify-center mt-12 mb-8 container mx-auto px-4">
          <button
            onClick={handleLoadMore}
            className="group flex items-center justify-center gap-2 px-8 py-3.5 w-full md:w-auto rounded-xl font-semibold bg-[#f8f5fe] hover:bg-[#e9d5ff] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg"
          >
            <span className="text-lg group-hover:translate-y-0.5 transition-transform duration-300">
              <img
                src={'/images/arrow-down.svg'}
                alt={'arow icon'}
                className="w-[24px] h-[24px] object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            </span>

            <span className="font-inter font-medium text-base leading-6 tracking-normal [leading-trim:none] text-[#6941C6]">
              Load more
            </span>
          </button>
        </div>
      )}
    </>
  );
}
