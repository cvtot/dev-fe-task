# Cấu trúc Project

Dự án này được tổ chức theo cấu trúc chuyên nghiệp, tách biệt rõ ràng các phần để dễ bảo trì và mở rộng.

## 📁 Cấu trúc Thư mục

```
dev-fe-task/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── posts/         # Posts API endpoints
│   ├── blog/              # Blog pages
│   │   ├── [id]/         # Dynamic blog detail pages
│   │   └── page.tsx      # Blog list page
│   ├── posts/             # Posts pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
│
├── components/            # React Components
│   ├── blog/             # Blog-specific components
│   │   ├── BlogCard.tsx
│   │   ├── BlogList.tsx
│   │   ├── BlogSidebar.tsx
│   │   ├── BlogDetailClient.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── CommentsSection.tsx
│   │   └── index.ts      # Re-exports
│   ├── posts/            # Posts-specific components
│   │   ├── PostCard.tsx
│   │   ├── Pagination.tsx
│   │   ├── UserFilter.tsx
│   │   └── index.ts      # Re-exports
│   ├── ui/               # Reusable UI components
│   │   ├── SearchBar.tsx
│   │   └── index.ts      # Re-exports
│   └── layout/           # Layout components
│       ├── BlogHeader.tsx
│       └── index.ts      # Re-exports
│
├── lib/                  # Utilities & Helpers
│   ├── api/              # API functions
│   │   ├── client.ts    # API client configuration
│   │   ├── posts.ts     # Posts API functions
│   │   ├── users.ts     # Users API functions
│   │   ├── comments.ts  # Comments API functions
│   │   └── index.ts     # Re-exports
│   └── utils/           # Utility functions
│       ├── images.ts    # Image utilities
│       ├── blog-helpers.ts  # Blog transformation functions
│       ├── post-enhancements.ts  # Post enhancement utilities
│       └── index.ts     # Re-exports
│
├── types/                # TypeScript Types & Interfaces
│   └── index.ts         # All type definitions
│
├── hooks/                # Custom React Hooks
│   └── (reserved for future hooks)
│
├── constants/            # Constants & Configurations
│   └── (reserved for constants)
│
├── docs/                 # Documentation
│   └── *.md             # Various documentation files
│
├── __tests__/            # Unit Tests
│   └── components.test.tsx
│
├── e2e/                  # E2E Tests (Playwright)
│   └── blog.spec.ts
│
└── public/               # Static Assets
    └── images/          # Image files
```

## 🎯 Tổ chức Components

### Blog Components (`components/blog/`)
Các component liên quan đến chức năng blog:
- `BlogCard` - Hiển thị card của một blog post
- `BlogList` - Danh sách blog với search và load more
- `BlogSidebar` - Sidebar với popular posts và tags
- `BlogDetailClient` - Client component để log data
- `Breadcrumbs` - Navigation breadcrumbs
- `CommentsSection` - Section hiển thị và thêm comments

### Posts Components (`components/posts/`)
Các component cho trang posts explorer:
- `PostCard` - Card hiển thị post
- `Pagination` - Pagination controls
- `UserFilter` - Filter theo user

### UI Components (`components/ui/`)
Các component UI có thể tái sử dụng:
- `SearchBar` - Search input với debounce

### Layout Components (`components/layout/`)
Các component layout:
- `BlogHeader` - Header navigation

## 🔧 Tổ chức Lib

### API (`lib/api/`)
Tất cả các function gọi API được tách theo resource:
- `posts.ts` - Posts API functions
- `users.ts` - Users API functions
- `comments.ts` - Comments API functions
- `client.ts` - Base API client configuration

### Utils (`lib/utils/`)
Các utility functions:
- `images.ts` - Image generation utilities
- `blog-helpers.ts` - Blog transformation functions
- `post-enhancements.ts` - Post enhancement utilities

## 📝 Types

Tất cả TypeScript types và interfaces được tập trung trong `types/index.ts`:
- API types (Post, User, Comment)
- Enhanced types (EnhancedPost, EnhancedUser)
- Blog types (BlogPost)
- Component prop types

## 📚 Import Conventions

### Components
```typescript
// Từ index.ts (recommended)
import { BlogCard, BlogList } from '@/components/blog';
import { PostCard, Pagination } from '@/components/posts';
import { SearchBar } from '@/components/ui';

// Hoặc direct import
import BlogCard from '@/components/blog/BlogCard';
```

### Types
```typescript
import type { BlogPost, Post, User, Comment } from '@/types';
```

### API Functions
```typescript
import { fetchPosts, fetchUsers, fetchComments } from '@/lib/api';
```

### Utilities
```typescript
import { transformPostsToBlogPosts, getUserAvatar } from '@/lib/utils';
```

## 🎨 Best Practices

1. **Separation of Concerns**: Mỗi file chỉ làm một việc cụ thể
2. **Feature-based Organization**: Components được nhóm theo feature/domain
3. **Re-exports**: Sử dụng index.ts để export tiện lợi
4. **Type Safety**: Tất cả types được định nghĩa tập trung
5. **API Abstraction**: API functions được tách riêng và có thể test độc lập

## 📦 Migration Notes

Nếu bạn đang migrate từ cấu trúc cũ:

1. **Old imports** → **New imports**:
   - `@/components/BlogCard` → `@/components/blog/BlogCard` hoặc `@/components/blog`
   - `@/lib/api` → vẫn là `@/lib/api` (đã được tổ chức lại)
   - `@/lib/blog-helpers` → `@/lib/utils`

2. **Types**: Tất cả types từ components đã được move vào `@/types`

3. **Documentation**: Tất cả markdown files đã được move vào `docs/`

