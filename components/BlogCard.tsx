import { ISO } from '@/enum/iso';
import { PostModel } from '@/models/post';
import { Helper } from '@/utils/date';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlogCard: React.FC<PostModel> = ({
  id,
  imageUrl,
  category,
  title,
  description,
  user,
}) => {
  return (
    <Link href={`/posts/${id}`} className="w-full">
      <article
        key={id}
        className="flex flex-col h-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
      >
        {/* Image */}
        <div className="w-full h-48 relative overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-1 rounded-full w-fit">
              {category}
            </span>

            <h3 className="text-lg font-semibold text-gray-900 leading-tight hover:text-purple-700 cursor-pointer">
              {title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={32}
              height={32}
              className="rounded-full"
              unoptimized
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-gray-500">
                {Helper.formatDate(user.date, ISO.DATE_WITH_SHORT_MONTH)}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
