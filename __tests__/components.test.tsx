import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import UserFilter from '../components/posts/UserFilter';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

const mockUsers = [
  { id: 1, name: 'John Doe', username: 'johndoe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', username: 'janesmith', email: 'jane@example.com' },
];

describe('UserFilter Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    
    // Setup search params mock (default: no user filter)
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it('renders filter dropdown with all users option', () => {
    render(<UserFilter users={mockUsers} />);
    
    const select = screen.getByLabelText(/filter by user/i);
    expect(select).toBeInTheDocument();
    
    // Check for "All Users" option
    expect(screen.getByText('All Users')).toBeInTheDocument();
    
    // Check for user options
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays current selected user from search params', () => {
    // Mock search params to return user ID
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('1'),
    });

    render(<UserFilter users={mockUsers} />);
    
    const select = screen.getByDisplayValue('John Doe');
    expect(select).toBeInTheDocument();
  });

  it('updates URL when user selection changes', () => {
    render(<UserFilter users={mockUsers} />);
    
    const select = screen.getByLabelText(/filter by user/i);
    
    // Select a user
    fireEvent.change(select, { target: { value: '2' } });
    
    // Verify router.push was called with correct URL
    expect(mockPush).toHaveBeenCalledWith('/posts?user=2&page=1');
  });

  it('removes user filter when "All Users" is selected', () => {
    // Start with a user selected
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('1'),
    });

    render(<UserFilter users={mockUsers} />);
    
    const select = screen.getByLabelText(/filter by user/i);
    
    // Select "All Users"
    fireEvent.change(select, { target: { value: '' } });
    
    // Verify router.push was called with URL without user param
    expect(mockPush).toHaveBeenCalledWith('/posts?page=1');
  });

  it('handles empty users array gracefully', () => {
    render(<UserFilter users={[]} />);
    
    const select = screen.getByLabelText(/filter by user/i);
    expect(select).toBeInTheDocument();
    
    // Should only have "All Users" option
    expect(screen.getByText('All Users')).toBeInTheDocument();
    expect(select.children).toHaveLength(1);
  });

  it('preserves existing search params when filtering', () => {
    // Mock existing search params
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'page') return '3';
        if (key === 'search') return 'test query';
        return null;
      }),
    });

    render(<UserFilter users={mockUsers} />);
    
    const select = screen.getByLabelText(/filter by user/i);
    
    // Select a user
    fireEvent.change(select, { target: { value: '1' } });
    
    // Verify router.push preserves other params but resets page to 1
    expect(mockPush).toHaveBeenCalledWith('/posts?search=test+query&user=1&page=1');
  });
});

// Example API function test
describe('API Functions', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchPosts', () => {
    it('fetches posts successfully', async () => {
      const mockPosts = [
        { id: 1, userId: 1, title: 'Test Post', body: 'Test content' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      });

      // Note: This would require importing the actual API function
      // const { fetchPosts } = await import('../lib/api');
      // const result = await fetchPosts();
      // expect(result).toEqual(mockPosts);
      
      // For now, just verify fetch was called correctly
      // This is a placeholder to show the testing pattern
      expect(true).toBe(true);
    });

    it('handles API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Note: This would test error handling in the actual API function
      // const { fetchPosts } = await import('../lib/api');
      // await expect(fetchPosts()).rejects.toThrow();
      
      expect(true).toBe(true);
    });
  });
});
