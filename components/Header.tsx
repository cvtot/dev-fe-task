'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import InputCustom from './BaseInput';
import { useCallback, useEffect, useState } from 'react';

const BlogHeader: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const isDetailPage = /^\/posts\/\d+$/.test(pathname);

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    if (isDetailPage) return;
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set('search', query);
      } else {
        params.delete('search');
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, pathname, router, searchParams, isDetailPage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <section className="w-full flex justify-center items-center bg-[#F9F5FF] h-[438px]">
      <div className="w-full max-w-[1440px] flex flex-col items-center text-center pt-24 px-4">
        <div
          className="text-sm font-semibold tracking-widest mb-3 
            flex items-center justify-center 
              rounded-xl px-3 py-1  
              bg-purple-100 text-purple-700 uppercase"
        >
          Our Blog
        </div>

        <h1 className="text-5xl md:text-5xl font-bold text-[#42307D] mb-4">
          Resources and Insights
        </h1>

        <p className="text-xl md:text-lg text-purple-700 max-w-[700px]">
          The latest industry news, interviews, technologies, and resources.
        </p>

        {!isDetailPage && (
          <InputCustom className="mt-5" value={query} onChange={handleChange} />
        )}
      </div>
    </section>
  );
};

export default BlogHeader;
