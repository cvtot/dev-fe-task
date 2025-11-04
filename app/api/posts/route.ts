import { NextResponse } from 'next/server';
import { fetchPosts, fetchUsers } from '@/lib/api';
import type { Post, User, BlogPost } from '@/types';
import { getUserAvatar } from '@/lib/utils';

// Transform JSONPlaceholder data to blog format
function transformPost(post: Post, user?: User, category?: string): BlogPost {
  // Create excerpt from body (first 150 chars)
  const excerpt =
    post.body.length > 150
      ? post.body.substring(0, 150).trim() + '...'
      : post.body;

  // Categories based on post title/content
  const categories = [
    'Design',
    'Product',
    'Software Engineering',
    'Management',
    'Customer Success',
  ];

  const selectedCategory = category || categories[post.id % categories.length];

  return {
    id: post.id,
    title: post.title,
    excerpt,
    content: post.body,
    category: selectedCategory,
    author: {
      name: user?.name || 'Unknown Author',
      avatar: user
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
        : 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    },
    publishedAt: new Date(2024, post.id % 12, (post.id % 28) + 1).toISOString(),
    image: getPostImage(post.id, post.title),
  };
}

// Get dynamic images based on post content
function getPostImage(postId: number, title: string): string {
  // Using placeholder.com for reliable images
  const colors = [
    '6366f1', // indigo
    '8b5cf6', // purple
    '06b6d4', // cyan
    '10b981', // emerald
    'f59e0b', // amber
    'ef4444', // red
    'ec4899', // pink
    '84cc16', // lime
    'f97316', // orange
    '3b82f6', // blue
  ];

  const bgColor = colors[postId % colors.length];

  return `https://via.placeholder.com/800x600/${bgColor}/FFFFFF?text=${encodeURIComponent(title.substring(0, 30))}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search')?.toLowerCase() || '';

    // Fetch posts and users in parallel
    const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()]);

    // Create a map of users by ID for quick lookup
    const userMap = new Map<number, User>();
    users.forEach((user) => userMap.set(user.id, user));

    // Transform posts to blog format
    let transformedPosts: BlogPost[] = posts.map((post) => {
      const user = userMap.get(post.userId);
      return transformPost(post, user);
    });

    // Apply search filter
    if (search) {
      transformedPosts = transformedPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search) ||
          post.category.toLowerCase().includes(search) ||
          post.author.name.toLowerCase().includes(search)
      );
    }

    // Apply pagination
    const paginatedPosts = transformedPosts.slice(offset, offset + limit);
    const hasMore = offset + limit < transformedPosts.length;

    return NextResponse.json({
      posts: paginatedPosts,
      total: transformedPosts.length,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', posts: [], total: 0, hasMore: false },
      { status: 500 }
    );
  }
}
