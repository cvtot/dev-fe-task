import type { Post, User, BlogPost } from '@/types';
import { getUserAvatar } from './images';

// Get real image URLs based on post content
function getPostImage(postId: number, title: string): string {
  // Using Picsum Photos for real high-quality images from Unsplash
  // Format: https://picsum.photos/id/{id}/800/600
  // Each postId maps to a specific image ID (1-1000)
  // This ensures each post has a consistent, real photograph
  
  // Map postId to image ID (1-1000 range)
  const imageId = (postId % 1000) + 1;
  
  // Return real photograph URL
  // These are actual high-quality photos from Unsplash via Lorem Picsum
  return `https://picsum.photos/id/${imageId}/800/600`;
}

// Transform JSONPlaceholder Post to BlogPost format
export function transformPostToBlogPost(post: Post, user?: User): BlogPost {
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

  const selectedCategory = categories[post.id % categories.length];

  return {
    id: post.id,
    title: post.title,
    excerpt,
    content: post.body,
    category: selectedCategory,
    author: {
      name: user?.name || 'Unknown Author',
      avatar: user ? getUserAvatar(user.id) : getUserAvatar(0),
    },
    publishedAt: new Date(2024, post.id % 12, (post.id % 28) + 1).toISOString(),
    image: getPostImage(post.id, post.title),
  };
}

// Transform array of posts to blog posts
export function transformPostsToBlogPosts(
  posts: Post[],
  users: User[]
): BlogPost[] {
  const userMap = new Map<number, User>();
  users.forEach((user) => userMap.set(user.id, user));

  return posts.map((post) => {
    const user = userMap.get(post.userId);
    return transformPostToBlogPost(post, user);
  });
}

