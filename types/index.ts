// API Types (from JSONPlaceholder)
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

// Enhanced Types
export interface EnhancedPost extends Post {
  coverImage: string;
  thumbnail: string;
  readTime: number;
  tags: string[];
  publishedAt: string;
}

export interface EnhancedUser extends User {
  avatar: string;
  bio: string;
  postsCount: number;
}

// Blog Types
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  image: string;
}

// Component Props Types
export interface BlogCardProps {
  post: BlogPost;
}

export interface BlogListProps {
  initialPosts: BlogPost[];
}

export interface CommentsSectionProps {
  postId: number;
  initialComments: Comment[];
}

export interface NewComment {
  name: string;
  email: string;
  body: string;
}

export interface SearchBarProps {
  onSearchChange?: (search: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  userId?: number | null;
}

export interface UserFilterProps {
  users: User[];
  selectedUserId: number | null;
}

export interface PostCardProps {
  id: number;
  title: string;
  body: string;
  user?: User;
}

