'use client';

import React, { useEffect, useMemo, useState } from 'react';
import BlogCard from '@/components/BlogCard';
import { enhancePost, fetchPosts, fetchUsers } from '@/lib/api';
import { mapPostToModel } from '@/mappers/post';
import { useSearchParams } from 'next/navigation';

interface LoadMorePaginationProps {
  totalPosts: number;
  initialPosts: any[];
  userId: number | null;
}

const POSTS_PER_PAGE = 9;

const LoadMorePagination: React.FC<LoadMorePaginationProps> = ({
  totalPosts,
  initialPosts,
  userId,
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const hasMore = posts.length < totalPosts;

  const handleLoadMore = async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const [allPosts, users] = await Promise.all([fetchPosts(), fetchUsers()]);
      const filtered = userId
        ? allPosts.filter((p) => p.userId === userId)
        : allPosts;

      const start = page * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;
      const nextPosts = filtered.slice(start, end).map((post) => {
        const enhanced = enhancePost(post);
        const user = users.find((u) => u.id === post.userId);
        const entity = { ...enhanced, user };
        return mapPostToModel(entity);
      });

      setPosts((prev) => [...prev, ...nextPosts]);
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    if (!search) return;
    const fetchAll = async () => {
      const [fetchedPosts, users] = await Promise.all([
        fetchPosts(),
        fetchUsers(),
      ]);
      const processed = fetchedPosts.map((post) => {
        const enhanced = enhancePost(post);
        const user = users.find((u) => u.id === post.userId);
        const entity = { ...enhanced, user };
        return mapPostToModel(entity);
      });
      setAllPosts(processed);
    };
    fetchAll();
  }, [search]);

  const filteredPosts = useMemo(() => {
    const base = search ? allPosts : posts;
    if (!search) return base;
    return base.filter(
      (p) =>
        (p.title || '').toLowerCase().includes(search) ||
        (p.body || '').toLowerCase().includes(search)
    );
  }, [search, posts, allPosts]);

  return (
    <div className="flex flex-col items-center">
      <div className="main-post grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center items-stretch">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>

      {!search && hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="load-more mt-6 px-6 py-2 bg-[#F9F5FF] text-purple-700 rounded-lg cursor-pointer"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default LoadMorePagination;
