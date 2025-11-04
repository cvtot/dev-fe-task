import { Suspense } from 'react';
import { enhancePost, fetchPosts, fetchUsers } from '@/lib/api';
import { mapPostToModel } from '@/mappers/post';
import LoadMorePagination from '@/components/LoadMorePagination';

interface SearchParams {
  page?: string;
  userId?: string;
}

interface PostsPageProps {
  searchParams: SearchParams;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  try {
    const {
      postsWithUsers,
      totalPosts,
      selectedUserId,
    } = await getPageData(searchParams);

    // truyền vào client component LoadMorePagination
    return (
      <div>
        <Suspense fallback={<div className="loading px-6">Loading posts...</div>}>
          {postsWithUsers.length > 0 ? (
            <LoadMorePagination
              totalPosts={totalPosts}
              initialPosts={postsWithUsers}
              userId={selectedUserId}
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500">
                {selectedUserId
                  ? 'Try selecting a different user or view all posts.'
                  : 'No posts are currently available.'}
              </p>
            </div>
          )}
        </Suspense>
      </div>
    );
  } catch (error) {
    return (
      <div className="error">
        <h3 className="text-lg font-semibold mb-2">Error Loading Posts</h3>
        <p>Sorry, we couldn't load the posts. Please try again later.</p>
        <p className="text-sm mt-2">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }
}

async function getPageData(searchParams: SearchParams) {
  const selectedUserId = searchParams.userId
    ? parseInt(searchParams.userId, 10)
    : null;

  const POSTS_PER_PAGE = 9;

  const [allPosts, users] = await Promise.all([fetchPosts(), fetchUsers()]);

  const filteredPosts = selectedUserId
    ? allPosts.filter((post) => post.userId === selectedUserId)
    : allPosts;

  const totalPosts = filteredPosts.length;
  const firstPagePosts = filteredPosts.slice(0, POSTS_PER_PAGE);

  const postsWithUsers = firstPagePosts.map((post) => {
    const enhanced = enhancePost(post);
    const user = users.find((u) => u.id === post.userId);
    const entity = { ...enhanced, user };
    return mapPostToModel(entity);
  });

  return {
    postsWithUsers,
    totalPosts,
    users,
    selectedUserId,
  };
}
