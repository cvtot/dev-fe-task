import React, { Fragment, Suspense } from 'react';
import Image from 'next/image';
import {
  fetchPosts,
  fetchUsers,
  enhancePost,
  enhanceUser,
  getPostThumbnail,
  getUserAvatar,
} from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import UserFilter from '@/components/UserFilter';
import { ArrowDownIcon, SearchIcon } from '@/components/svgs';
import bg from '@/assets/images/background.png';
import BlogCardsList from '@/components/BlogCardsList';
import BlogSearch from '@/components/BlogSearch';

interface SearchParams {
  page?: string;
  userId?: string;
  search?: string;
}

interface BlogPageProps {
  searchParams: SearchParams;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const selectedUserId = searchParams.userId
    ? parseInt(searchParams.userId, 10)
    : null;
  const searchQuery = searchParams.search?.toLowerCase() || '';

  const POSTS_PER_PAGE = 9;

  try {
    const [allPosts, users] = await Promise.all([fetchPosts(), fetchUsers()]);

    let filteredPosts = selectedUserId
      ? allPosts.filter((post) => post.userId === selectedUserId)
      : allPosts;

    if (searchQuery) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery) ||
          post.body.toLowerCase().includes(searchQuery)
      );
    }

    const allEnhancedPosts = filteredPosts.map((post) => {
      const user = users.find((u) => u.id === post.userId);
      const enhancedPostData = enhancePost(post);

      return {
        ...enhancedPostData,
        author: user ? enhanceUser(user) : null,
      };
    });

    return (
      <main className="blogs">
        <BlogSearch searchQuery={searchQuery} />
        <div className="blogs__wrapper-content">
          <div
            style={{
              backgroundImage: `url(${bg.src})`,
            }}
            className="banner"
          >
            <div className="container">
              <div className="content">
                <Suspense
                  fallback={
                    <div className="loading">Loading blog posts...</div>
                  }
                >
                  {allEnhancedPosts.length > 0 ? (
                    <BlogCardsList
                      posts={allEnhancedPosts}
                      hasMore={allEnhancedPosts.length > POSTS_PER_PAGE}
                      isLoading={false}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No blog posts found
                      </h3>
                      <p className="text-gray-500">
                        {selectedUserId
                          ? 'Try selecting a different author or view all posts.'
                          : searchQuery
                            ? 'Try searching with different keywords.'
                            : 'No blog posts are currently available.'}
                      </p>
                    </div>
                  )}
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="blogs">
        <div className="blogs__header">
          <h5>Our blog</h5>
          <h1>Resources and insights</h1>
        </div>
        <div className="blogs__wrapper-content">
          <div className="error p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Blog Posts
            </h3>
            <p className="text-gray-600">
              Sorry, we couldn't load the blog posts. Please try again later.
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </main>
    );
  }
}
