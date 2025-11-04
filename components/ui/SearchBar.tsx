'use client';

import { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import type { SearchBarProps } from '@/types';

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearchChange?.(value);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder="Search"
        className="w-full pl-14 pr-5 py-3 h-[48px] bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple-500 focus:border-[1px] focus:border-brand-purple-500 outline-none transition-all shadow-sm hover:shadow-md focus:shadow-lg text-gray-900 placeholder:text-gray-400"
      />
    </div>
  );
}
