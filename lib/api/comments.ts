import type { Comment } from '@/types';
import { apiCall } from './client';

// Fetch comments for a specific post
export async function fetchComments(postId: number): Promise<Comment[]> {
  return apiCall<Comment[]>(`/posts/${postId}/comments`);
}

