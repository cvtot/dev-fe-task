'use client';

import React, { useEffect, useState } from 'react';
import { SearchIcon } from '@/components/svgs';
import { useDebounce } from '@/hook/useDebounce';
import { useHistory } from '@/hook/useHistory';

interface Props {
  searchQuery?: string;
}

const BlogSearch: React.FC<Props> = ({ searchQuery }) => {
  const [query, setQuery] = useState(searchQuery || '');

  const debouncedQuery = useDebounce(query, 600);
  const { push, reset } = useHistory();

  useEffect(() => {
    if (query === '') {
      reset();
    }
  }, [query, push]);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery !== '') {
      push({ params: { search: debouncedQuery } });
    }
  }, [debouncedQuery, push]);

  return (
    <div className="blogs__header">
      <h5>Our blog</h5>
      <h1>Resources and insights</h1>
      <p>The latest industry news, interviews, technologies, and resources.</p>
      <div className="text-center relative w-fit mx-auto">
        <span className="search-icon">
          <SearchIcon />
        </span>
        <input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          type="search"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default BlogSearch;
