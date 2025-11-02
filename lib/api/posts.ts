import type { Post } from '@/types';
import { apiCall } from './client';

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

// Fetch posts by a specific user
export async function fetchPostsByUser(userId: number): Promise<Post[]> {
  return apiCall<Post[]>(`/users/${userId}/posts`);
}

