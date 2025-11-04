import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { BlogPost, Comment } from '@/types';
import { fetchPost, fetchUsers, fetchComments, fetchPosts } from '@/lib/api';
import {
  transformPostToBlogPost,
  transformPostsToBlogPosts,
} from '@/lib/utils';
import BlogDetailClient from '@/components/blog/BlogDetailClient';
import CommentsSection from '@/components/blog/CommentsSection';
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import BlogSidebar from '@/components/blog/BlogSidebar';

async function getPost(id: string): Promise<BlogPost | null> {
  try {
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return null;
    }

    // Fetch post and users from JSONPlaceholder API
    const [post, users] = await Promise.all([fetchPost(postId), fetchUsers()]);

    console.log('📄 Blog Detail - Raw Post Data:', post);
    console.log('👥 Blog Detail - All Users:', users);

    if (!post) {
      return null;
    }

    // Find user for this post
    const user = users.find((u) => u.id === post.userId);

    // Transform to blog format
    const blogPost = transformPostToBlogPost(post, user);
    console.log('✨ Blog Detail - Transformed BlogPost:', blogPost);

    return blogPost;
  } catch (error) {
    console.error('❌ Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getPost(params.id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Our Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const postId = parseInt(params.id, 10);
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  // Fetch comments from JSONPlaceholder API
  let comments: Comment[] = [];
  try {
    comments = await fetchComments(postId);
    console.log('💬 Blog Detail - Comments:', comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Get previous/next posts for navigation
  const [allPosts, allUsers] = await Promise.all([fetchPosts(), fetchUsers()]);
  const blogPosts = transformPostsToBlogPosts(allPosts, allUsers);
  const currentIndex = blogPosts.findIndex((p) => p.id === postId);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white py-4">
      {/* Client-side logging component */}
      <BlogDetailClient post={post} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs category={post.category} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-2">
            {/* Hero Image */}
            <div className="w-full h-80 md:h-96 mb-8 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Author Info with Comments Count */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">by</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {post.author.name}
                  </span>
                  <span className="text-sm text-gray-400">-</span>
                  <span className="text-sm text-gray-600">{formattedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{comments.length}</span>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-sm md:prose-lg max-w-none mb-12">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </article>

            {/* Comments Section */}
            <CommentsSection postId={postId} initialComments={comments} />

            {/* Pagination */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-12">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-sm font-medium">Previous</span>
                </Link>
              ) : (
                <div></div>
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="text-sm font-medium">Next</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <BlogSidebar currentPostId={postId} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
