'use client';

import React, { Fragment, useState } from 'react';
import { ArrowDownIcon } from '@/components/svgs';
import BlogCard from './BlogCard';
import { getUserAvatar } from '@/lib/api';
import Link from 'next/link';

type Props = {
  posts: any;
  isLoading: boolean;
  hasMore: boolean;
};

const BlogCardsList: React.FC<Props> = ({ posts, isLoading }) => {
  const [displayedCount, setDisplayedCount] = useState(9);

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 9);
  };

  const visiblePosts = posts.slice(0, displayedCount);

  return (
    <Fragment>
      <div className="blogs__list-card">
        {visiblePosts.map((post: any) => (
          <Link href={`/blogs/${post.id}`} key={post.id}>
            <BlogCard
              imageSrc={post.thumbnail}
              title={post.title}
              name={post.title}
              description={post.body.substring(0, 120) + '...'}
              avatarSrc={post.author?.avatar || getUserAvatar(post.userId)}
              nameAuthor={post.author?.name || 'Unknown Author'}
              date={new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            />
          </Link>
        ))}
      </div>

      {displayedCount < posts.length && (
        <button
          className="blogs__btn"
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          <ArrowDownIcon />
          <span>{isLoading ? 'Loading...' : 'Load more'}</span>
        </button>
      )}
    </Fragment>
  );
};

export default BlogCardsList;
