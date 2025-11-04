'use client';

import { useEffect } from 'react';
import type { BlogPost } from '@/types';

interface BlogDetailClientProps {
  post: BlogPost;
}

export default function BlogDetailClient({ post }: BlogDetailClientProps) {
  useEffect(() => {
    console.log('📄 Blog Detail - Post Data:', post);
    console.log('📄 Blog Detail - Post ID:', post.id);
    console.log('📄 Blog Detail - Post Title:', post.title);
    console.log('📄 Blog Detail - Post Author:', post.author);
    console.log('📄 Blog Detail - Post Content:', post.content);
    console.log('📄 Blog Detail - Full Post Object:', post);
  }, [post]);

  return null; // This component only logs, doesn't render
}

