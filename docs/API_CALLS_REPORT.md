# 📊 Báo Cáo Kiểm Tra API Calls

## ✅ Tổng Quan

Source code **CÓ gọi API** và đang sử dụng **JSONPlaceholder API** để lấy dữ liệu thật.

---

## 🔍 Chi Tiết Các API Calls

### 1. **JSONPlaceholder API** (External API)
**Base URL:** `https://jsonplaceholder.typicode.com`

#### Các endpoints được gọi:

| Endpoint | File | Hàm | Mô tả |
|----------|------|-----|-------|
| `/posts` | `lib/api.ts:143` | `fetchPosts()` | Lấy tất cả posts (100 posts) |
| `/posts/{id}` | `lib/api.ts:149` | `fetchPost(id)` | Lấy 1 post theo ID |
| `/users` | `lib/api.ts:161` | `fetchUsers()` | Lấy tất cả users (10 users) |
| `/users/{id}` | `lib/api.ts:167` | `fetchUser(id)` | Lấy 1 user theo ID |
| `/posts/{id}/comments` | `lib/api.ts:179` | `fetchComments(postId)` | Lấy comments của post |
| `/users/{userId}/posts` | `lib/api.ts:184` | `fetchPostsByUser(userId)` | Lấy posts của user |

---

### 2. **Internal API Route** (`/api/posts`)
**File:** `app/api/posts/route.ts`

#### Được gọi từ:

**a) Blog List Page** (`app/blog/page.tsx:11`)
```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts?limit=100`)
```
- **Mục đích:** Lấy tất cả posts để hiển thị trên blog list
- **Cache:** `no-store` (luôn fetch mới)

**b) Blog Detail Page** (`app/blog/[id]/page.tsx:10`)
```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts?limit=100`)
```
- **Mục đích:** Lấy tất cả posts rồi filter theo ID
- **Cache:** `no-store` (luôn fetch mới)

---

### 3. **API Route Handler** (`/api/posts/route.ts`)
**File:** `app/api/posts/route.ts:89`

Đây là route handler gọi JSONPlaceholder:

```typescript
const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()]);
```

**Flow:**
1. Nhận request từ frontend
2. Gọi `fetchPosts()` → JSONPlaceholder `/posts`
3. Gọi `fetchUsers()` → JSONPlaceholder `/users`
4. Transform data sang format blog
5. Apply search filter (nếu có)
6. Apply pagination
7. Return JSON response

---

## 📈 Data Flow

```
Frontend (Blog Page)
    ↓
GET /api/posts?limit=100
    ↓
API Route Handler (app/api/posts/route.ts)
    ↓
Parallel Fetch:
  - fetchPosts() → https://jsonplaceholder.typicode.com/posts
  - fetchUsers() → https://jsonplaceholder.typicode.com/users
    ↓
Transform Data
    ↓
Return Blog Posts Format
```

---

## 🎯 Tóm Tắt API Calls

### External APIs (JSONPlaceholder)
✅ **Đang sử dụng:**
- `GET https://jsonplaceholder.typicode.com/posts` - 100 posts
- `GET https://jsonplaceholder.typicode.com/users` - 10 users

### Internal API Routes
✅ **Đang sử dụng:**
- `GET /api/posts` - Blog posts với transformation

### External Services (Images/Avatars)
✅ **Đang sử dụng:**
- `https://api.dicebear.com/7.x/avataaars/svg?seed={userId}` - User avatars
- `https://via.placeholder.com/800x600/{color}/FFFFFF?text={title}` - Post images

---

## 📋 Chi Tiết Theo File

### `lib/api.ts`
**Chức năng:** Utility functions để gọi JSONPlaceholder API

**Functions:**
```typescript
apiCall<T>(endpoint)      // Generic API caller
fetchPosts()              // GET /posts
fetchPost(id)            // GET /posts/{id}
fetchUsers()             // GET /users
fetchUser(id)            // GET /users/{id}
fetchComments(postId)    // GET /posts/{id}/comments
fetchPostsByUser(userId) // GET /users/{userId}/posts
```

**Caching:** `next: { revalidate: 300 }` (5 phút)

---

### `app/api/posts/route.ts`
**Chức năng:** Next.js API route handler

**Gọi:**
- `fetchPosts()` từ `lib/api.ts` → JSONPlaceholder
- `fetchUsers()` từ `lib/api.ts` → JSONPlaceholder

**Trả về:** Blog posts format (transformed data)

---

### `app/blog/page.tsx`
**Chức năng:** Blog list page (Server Component)

**API Call:**
```typescript
fetch('http://localhost:3000/api/posts?limit=100')
```

**Cache:** `no-store` (server-side)

---

### `app/blog/[id]/page.tsx`
**Chức năng:** Blog detail page (Server Component)

**API Call:**
```typescript
fetch('http://localhost:3000/api/posts?limit=100')
// Sau đó filter theo ID trong JavaScript
```

**Cache:** `no-store` (server-side)

---

## ✅ Kết Luận

### Có Gọi API Không?
**✅ CÓ** - Source code đang gọi nhiều API:

1. **JSONPlaceholder API** (External)
   - Posts endpoint: ✅ Đang dùng
   - Users endpoint: ✅ Đang dùng

2. **Internal API Route** (`/api/posts`)
   - ✅ Đang dùng từ Blog pages

3. **Image Services**
   - DiceBear API: ✅ Đang dùng cho avatars
   - Placeholder.com: ✅ Đang dùng cho post images

### Tổng Số API Calls

| Loại | Số lượng | Status |
|------|----------|--------|
| External APIs | 2 endpoints | ✅ Active |
| Internal Routes | 1 route | ✅ Active |
| Image Services | 2 services | ✅ Active |
| **TỔNG** | **5 API calls** | ✅ **Đang hoạt động** |

---

## 🔧 Cấu Hình

### Environment Variables
- `NEXT_PUBLIC_BASE_URL` (optional) - Default: `http://localhost:3000`

### Next.js Image Domains
Đã cấu hình trong `next.config.js`:
- ✅ `via.placeholder.com`
- ✅ `api.dicebear.com`
- ✅ `images.unsplash.com`
- ✅ `jsonplaceholder.typicode.com`

---

## 📝 Recommendations

1. ✅ **Hiện tại:** Đang dùng real API từ JSONPlaceholder
2. ✅ **Caching:** Đã có caching 5 phút cho JSONPlaceholder calls
3. ⚠️ **Optimization:** Blog detail page fetch tất cả posts, có thể optimize bằng cách fetch 1 post thôi

---

**Status: ✅ Tất cả API calls đang hoạt động bình thường**

