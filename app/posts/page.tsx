import { Suspense } from 'react';
import { fetchPosts, fetchUsers } from '@/lib/api';
import PostCard from '@/components/posts/PostCard';
import Pagination from '@/components/posts/Pagination';
import UserFilter from '@/components/posts/UserFilter';

interface SearchParams {
  page?: string;
  userId?: string;
}

interface PostsPageProps {
  searchParams: SearchParams;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const selectedUserId = searchParams.userId ? parseInt(searchParams.userId, 10) : null;
  
  const POSTS_PER_PAGE = 10;

  try {
    // Fetch posts and users in parallel
    const [allPosts, users] = await Promise.all([
      fetchPosts(),
      fetchUsers(),
    ]);

    // Filter posts by user if specified
    const filteredPosts = selectedUserId 
      ? allPosts.filter(post => post.userId === selectedUserId)
      : allPosts;

    // Calculate pagination
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPosts = filteredPosts.slice(startIndex, endIndex);

    // Get user info for posts
    const postsWithUsers = currentPosts.map(post => ({
      ...post,
      user: users.find(user => user.id === post.userId),
    }));

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-4">Posts Explorer</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600">
              Showing {currentPosts.length} of {totalPosts} posts
              {selectedUserId && (
                <span className="ml-2 text-blue-600 font-medium">
                  (filtered by user)
                </span>
              )}
            </p>
            <UserFilter users={users} selectedUserId={selectedUserId} />
          </div>
        </div>

        <Suspense fallback={<div className="loading">Loading posts...</div>}>
          {currentPosts.length > 0 ? (
            <div className="space-y-4">
              {postsWithUsers.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  body={post.body}
                  user={post.user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500">
                {selectedUserId 
                  ? 'Try selecting a different user or view all posts.'
                  : 'No posts are currently available.'
                }
              </p>
            </div>
          )}
        </Suspense>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            userId={selectedUserId}
          />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="error">
        <h3 className="text-lg font-semibold mb-2">Error Loading Posts</h3>
        <p>
          Sorry, we couldn't load the posts. Please try again later.
        </p>
        <p className="text-sm mt-2">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }
}
