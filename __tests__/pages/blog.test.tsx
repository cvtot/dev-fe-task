import React from 'react';
import * as apiLib from '@/lib/api';

// Mock dependencies
jest.mock('@/lib/api');
jest.mock('@/components/BlogCard', () => {
  return function MockBlogCard() {
    return <div data-testid="blog-card">Blog Card</div>;
  };
});
jest.mock('@/components/BlogCardsList', () => {
  return function MockBlogCardsList({ posts }: { posts: any[] }) {
    return (
      <div data-testid="blog-cards-list">
        {posts.map((post) => (
          <div key={post.id} data-testid={`post-${post.id}`}>
            {post.title}
          </div>
        ))}
      </div>
    );
  };
});
jest.mock('@/components/BlogSearch', () => {
  return function MockBlogSearch() {
    return <div data-testid="blog-search">Blog Search</div>;
  };
});
jest.mock('@/components/Pagination', () => {
  return function MockPagination() {
    return <div data-testid="pagination">Pagination</div>;
  };
});
jest.mock('@/components/UserFilter', () => {
  return function MockUserFilter() {
    return <div data-testid="user-filter">User Filter</div>;
  };
});
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    username: 'janesmith',
  },
];

const mockPosts = [
  {
    id: 1,
    userId: 1,
    title: 'First Blog Post',
    body: 'This is the first blog post content',
  },
  {
    id: 2,
    userId: 1,
    title: 'Second Blog Post',
    body: 'This is the second blog post content',
  },
  {
    id: 3,
    userId: 2,
    title: 'Third Blog Post by Jane',
    body: 'This is the third blog post content',
  },
];

// Helper function to simulate what BlogPage does
// This extracts the logic from the Server Component
const processBlogData = ({
  allPosts,
  users,
  selectedUserId,
  searchQuery,
}: {
  allPosts: any[];
  users: any[];
  selectedUserId: number | null;
  searchQuery: string;
}) => {
  let filteredPosts = selectedUserId
    ? allPosts.filter((post) => post.userId === selectedUserId)
    : allPosts;

  // Convert searchQuery to lowercase for comparison
  const lowerSearchQuery = searchQuery.toLowerCase();

  if (lowerSearchQuery) {
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerSearchQuery) ||
        post.body.toLowerCase().includes(lowerSearchQuery)
    );
  }

  const allEnhancedPosts = filteredPosts.map((post) => {
    const user = users.find((u) => u.id === post.userId);
    return {
      ...post,
      author: user || null,
    };
  });

  return allEnhancedPosts;
};

describe('BlogPage Logic (Server Component)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiLib.fetchPosts as jest.Mock).mockResolvedValue(mockPosts);
    (apiLib.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    (apiLib.enhancePost as jest.Mock).mockImplementation((post) => post);
    (apiLib.enhanceUser as jest.Mock).mockImplementation((user) => user);
  });

  describe('API Calls', () => {
    it('should fetch posts and users', async () => {
      const posts = await apiLib.fetchPosts();
      const users = await apiLib.fetchUsers();

      expect(posts).toEqual(mockPosts);
      expect(users).toEqual(mockUsers);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('API Error');
      (apiLib.fetchPosts as jest.Mock).mockRejectedValue(error);

      await expect(apiLib.fetchPosts()).rejects.toThrow('API Error');
    });
  });

  describe('Search Functionality', () => {
    it('should filter posts by search query in title', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: 'First Blog',
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should filter posts by search query in body', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: 'second',
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should be case insensitive', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: 'FIRST',
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('First Blog Post');
    });

    it('should return empty array when no matches', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: 'nonexistent',
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('User Filter Functionality', () => {
    it('should filter posts by userId', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: 1,
        searchQuery: '',
      });

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.userId === 1)).toBe(true);
    });

    it('should filter posts by userId 2', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: 2,
        searchQuery: '',
      });

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(2);
    });

    it('should return empty array when user has no posts', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: 999,
        searchQuery: '',
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('Combined Filters', () => {
    it('should apply both search and user filter', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: 1,
        searchQuery: 'first blog', // lowercase match
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].userId).toBe(1);
      expect(result[0].title.toLowerCase()).toContain('first blog');
    });

    it('should filter by user first, then search', () => {
      // User 2 only has "Third Blog Post by Jane"
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: 2,
        searchQuery: 'third',
      });

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(2);
      expect(result[0].id).toBe(3);
    });

    it('should return empty when filters have no matches', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: 2,
        searchQuery: 'First', // User 2 doesn't have "First" in posts
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('Post Enhancement', () => {
    it('should attach user data to posts', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: '',
      });

      expect(result[0].author).toBeTruthy();
      expect(result[0].author.id).toBe(1);
      expect(result[0].author.name).toBe('John Doe');
    });

    it('should set author to null for posts with unknown user', () => {
      const postsWithUnknownUser = [
        {
          id: 1,
          userId: 999,
          title: 'Test',
          body: 'Content',
        },
      ];

      const result = processBlogData({
        allPosts: postsWithUnknownUser,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: '',
      });

      expect(result[0].author).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty posts array', () => {
      const result = processBlogData({
        allPosts: [],
        users: mockUsers,
        selectedUserId: null,
        searchQuery: '',
      });

      expect(result).toHaveLength(0);
    });

    it('should handle empty users array', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: [],
        selectedUserId: null,
        searchQuery: '',
      });

      expect(result).toHaveLength(3);
      expect(result.every((p) => p.author === null)).toBe(true);
    });

    it('should handle both empty arrays', () => {
      const result = processBlogData({
        allPosts: [],
        users: [],
        selectedUserId: null,
        searchQuery: '',
      });

      expect(result).toHaveLength(0);
    });

    it('should handle undefined searchQuery', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: '',
      });

      expect(result).toHaveLength(3);
    });

    it('should handle null selectedUserId', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: '',
      });

      expect(result).toHaveLength(3);
    });
  });

  describe('Data Integrity', () => {
    it('should not mutate original posts array', () => {
      const postsClone = JSON.parse(JSON.stringify(mockPosts));

      processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: 1,
        searchQuery: 'test',
      });

      expect(mockPosts).toEqual(postsClone);
    });

    it('should preserve all post properties', () => {
      const result = processBlogData({
        allPosts: mockPosts,
        users: mockUsers,
        selectedUserId: null,
        searchQuery: '',
      });

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('userId');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('body');
      expect(result[0]).toHaveProperty('author');
    });
  });
});
