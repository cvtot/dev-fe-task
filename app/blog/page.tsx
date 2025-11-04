import type { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';
import type { BlogPost } from '@/types';
import { fetchPosts, fetchUsers } from '@/lib/api';
import { transformPostsToBlogPosts } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Our Blog - Resources and Insights',
  description:
    'The latest industry news, interviews, technologies, and resources.',
};

async function getPosts(): Promise<BlogPost[]> {
  // Fetch directly from JSONPlaceholder API
  const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()]);

  console.log('📋 Blog List - Raw Posts Data:', posts);
  console.log('👥 Blog List - All Users:', users);
  console.log('📊 Blog List - Posts Count:', posts.length);
  console.log('📊 Blog List - Users Count:', users.length);

  // Transform to blog format
  const blogPosts = transformPostsToBlogPosts(posts, users);
  console.log('✨ Blog List - Transformed BlogPosts:', blogPosts);
  console.log('📊 Blog List - BlogPosts Count:', blogPosts.length);

  return blogPosts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Background decoration - Enhanced purple theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-48 top-48 w-96 h-96 bg-brand-purple-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -right-48 bottom-48 w-96 h-96 bg-brand-purple-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-purple-50 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Main content */}
      <div className="relative">
        {/* Header - 100vw */}
        <header className="w-screen text-center py-8 md:py-12 px-4 bg-[#F9F5FF]">
          {/* Tag "Our blog" - Bold purple pill */}
          <div className="inline-block mb-6">
            <span className="inline-block px-5 py-2 bg-[#f1ecfd] text-[#6941C6] text-sm rounded-full">
              Our blog
            </span>
          </div>

          {/* Title with prominent purple */}
          <h1 className="font-inter font-semibold text-3xl md:text-5xl leading-[36px] md:leading-[60px] tracking-[-0.02em] text-center [leading-trim:none]">
            <span className="text-[#42307D]">Resources and insights</span>
          </h1>

          {/* Description */}

          <p className="font-inter font-normal text-base md:text-xl leading-6 md:leading-[30px] tracking-normal text-center [leading-trim:none] text-[#6941C6] px-4">
            The latest industry news, interviews, technologies, and resources.
          </p>
        </header>

        {/* Blog list with search and load more - 100vw */}
        <div className="w-screen bg-white mb-16">
          <BlogList initialPosts={posts} />
        </div>
      </div>
    </div>
  );
}
