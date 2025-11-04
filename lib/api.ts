// Types for JSONPlaceholder API responses
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Utility functions for generating placeholder images using Picsum
export function getUserAvatar(userId: number): string {
  // Using Picsum for consistent user avatars - 40x40 for avatars
  return `https://picsum.photos/40/40?random=${userId}`;
}

export function getPostCoverImage(postId: number, title?: string): string {
  // Using Picsum for cover images - 1200x600
  // Picsum uses ?random=ID to cache the same image for the same ID
  return `https://picsum.photos/1200/600?random=${postId}`;
}

export function getPostThumbnail(postId: number, title?: string): string {
  // Smaller version for post cards - 600x300 using Picsum
  return `https://picsum.photos/600/300?random=${postId}`;
}

// Alternative: Generate SVG-based cover images for consistent branding
export function getPostCoverSVG(postId: number, title: string): string {
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#06b6d4',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#84cc16',
    '#f97316',
    '#3b82f6',
  ];
  const bgColor = colors[postId % colors.length];
  const titleEncoded = encodeURIComponent(title.substring(0, 50));

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${postId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bgColor}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad${postId})"/>
      <text x="60" y="300" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="start">
        ${titleEncoded}
      </text>
      <circle cx="1050" cy="150" r="80" fill="white" opacity="0.1"/>
      <circle cx="950" cy="450" r="60" fill="white" opacity="0.1"/>
    </svg>
  `)}`;
}

// Utility function for API calls with error handling
async function apiCall<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
}

// Fetch all posts
export async function fetchPosts(): Promise<Post[]> {
  return apiCall<Post[]>('/posts');
}

// Fetch a single post by ID
export async function fetchPost(id: number): Promise<Post | null> {
  try {
    return await apiCall<Post>(`/posts/${id}`);
  } catch (error) {
    // Return null if post not found, re-throw other errors
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  return apiCall<User[]>('/users');
}

// Fetch a single user by ID
export async function fetchUser(id: number): Promise<User | null> {
  try {
    return await apiCall<User>(`/users/${id}`);
  } catch (error) {
    // Return null if user not found, re-throw other errors
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}

// Fetch comments for a specific post
export async function fetchComments(postId: number): Promise<Comment[]> {
  return apiCall<Comment[]>(`/posts/${postId}/comments`);
}

// Fetch posts by a specific user
export async function fetchPostsByUser(userId: number): Promise<Post[]> {
  return apiCall<Post[]>(`/users/${userId}/posts`);
}

// Enhanced Post interface with additional UI data
export interface EnhancedPost extends Post {
  coverImage: string;
  thumbnail: string;
  readTime: number;
  tags: string[];
  publishedAt: string;
}

// Enhanced User interface with avatar
export interface EnhancedUser extends User {
  avatar: string;
  bio: string;
  postsCount: number;
}

// Enhance posts with additional UI-friendly data
export function enhancePost(post: Post): EnhancedPost {
  const tags = [
    'React',
    'JavaScript',
    'Web Dev',
    'Tutorial',
    'Tips',
    'Guide',
    'TypeScript',
    'Next.js',
    'API',
    'Frontend',
  ];
  const randomTags = tags
    .sort(() => 0.5 - Math.random())
    .slice(0, 2 + (post.id % 3));

  return {
    ...post,
    coverImage: getPostCoverImage(post.id, post.title),
    thumbnail: getPostThumbnail(post.id, post.title),
    readTime: Math.ceil(3 + post.body.length / 150),
    tags: randomTags,
    publishedAt: new Date(2024, post.id % 12, (post.id % 28) + 1).toISOString(),
  };
}

// Enhance user with additional UI-friendly data
export function enhanceUser(user: User, postsCount: number = 10): EnhancedUser {
  const bios = [
    'Full-stack developer passionate about clean code and user experience.',
    'Tech enthusiast sharing insights on modern web development.',
    'Software engineer with a love for React and TypeScript.',
    'Frontend developer creating beautiful and functional interfaces.',
    'Backend specialist focusing on scalable architectures.',
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
