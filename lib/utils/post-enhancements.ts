import type { Post, EnhancedPost, User, EnhancedUser } from '@/types';
import { getPostCoverImage, getPostThumbnail, getUserAvatar } from './images';

// Enhance posts with additional UI-friendly data
export function enhancePost(post: Post): EnhancedPost {
  const tags = ['React', 'JavaScript', 'Web Dev', 'Tutorial', 'Tips', 'Guide', 'TypeScript', 'Next.js', 'API', 'Frontend'];
  const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, 2 + (post.id % 3));
  
  return {
    ...post,
    coverImage: getPostCoverImage(post.id, post.title),
    thumbnail: getPostThumbnail(post.id, post.title),
    readTime: Math.ceil(3 + (post.body.length / 150)),
    tags: randomTags,
    publishedAt: new Date(2024, (post.id % 12), (post.id % 28) + 1).toISOString(),
  };
}

// Enhance user with additional UI-friendly data
export function enhanceUser(user: User, postsCount: number = 10): EnhancedUser {
  const bios = [
    'Full-stack developer passionate about clean code and user experience.',
    'Tech enthusiast sharing insights on modern web development.',
    'Software engineer with a love for React and TypeScript.',
    'Frontend developer creating beautiful and functional interfaces.',
    'Backend specialist focusing on scalable architectures.'
  ];
  
  return {
    ...user,
    avatar: getUserAvatar(user.id),
    bio: bios[user.id % bios.length],
    postsCount,
  };
}

// Utility function to get posts with pagination
export function paginatePosts(posts: Post[], page: number, limit: number = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    posts: posts.slice(startIndex, endIndex),
    totalPages: Math.ceil(posts.length / limit),
    currentPage: page,
    totalPosts: posts.length,
    hasNextPage: endIndex < posts.length,
    hasPrevPage: startIndex > 0,
  };
}

