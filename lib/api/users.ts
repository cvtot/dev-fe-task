import type { User } from '@/types';
import { apiCall } from './client';

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

