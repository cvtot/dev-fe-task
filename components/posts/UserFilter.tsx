'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { User, UserFilterProps } from '@/types';

export default function UserFilter({ users, selectedUserId }: UserFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUserChange = (userId: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Reset to first page when changing filter
    params.delete('page');
    
    if (userId === 'all') {
      params.delete('userId');
    } else {
      params.set('userId', userId);
    }
    
    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className="form-group">
      <label htmlFor="user-filter" className="form-label">
        Filter by User
      </label>
      <select
        id="user-filter"
        className="form-select"
        value={selectedUserId?.toString() || 'all'}
        onChange={(e) => handleUserChange(e.target.value)}
        aria-label="Filter posts by user"
      >
        <option value="all">All Users</option>
        {users.map((user) => (
          <option key={user.id} value={user.id.toString()}>
            {user.name} (@{user.username})
          </option>
        ))}
      </select>
    </div>
  );
}
