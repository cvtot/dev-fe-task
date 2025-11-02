import Link from 'next/link';
import type { BlogPost, BlogCardProps } from '@/types';

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link href={`/blog/${post.id}`} className="block h-full">
      <article className="group h-full bg-white  overflow-hidden border border-gray-200 shadow-md hover:border-brand-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col lg:mt-10 md:mt-0">
        {/* Image Container - 16:9 aspect ratio */}
        <div className="relative w-full aspect-[16/9] overflow-hidden p-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block py-1 text-xs font-semibold text-brand-purple-700 bg-white rounded-full tracking-wide">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <div className="flex flex-row justify-between items-start ">
            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-purple-600 transition-colors duration-300 line-clamp-2 leading-tight">
              {post.title}
            </h2>

            <img
              src={'/images/icon-wrap.svg'}
              alt={'arow icon'}
              className="w-[24px] h-[24px] object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          </div>
          {/* Excerpt */}
          {/* <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
            {post.excerpt}
          </p> */}
          <p className="font-inter font-normal text-base leading-6 tracking-normal leading-relaxed mb-6 flex-1 text-[#667085]">
            {post.excerpt}
          </p>

          {/* Author and Date */}
          <div className="flex items-center gap-3 pt-4 ">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-white">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {post.author.name}
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
            {/* Arrow icon */}
            {/* <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-5 h-5 text-brand-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div> */}
          </div>
        </div>
      </article>
    </Link>
  );
}
