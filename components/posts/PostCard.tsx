import Link from 'next/link';
import type { PostCardProps } from '@/types';

export default function PostCard({ id, title, body, user }: PostCardProps) {
  // Truncate body text for preview
  const truncatedBody = body.length > 120 ? body.slice(0, 120) + '...' : body;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4 leading-relaxed">
        {truncatedBody}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {user && (
            <>
              <span className="text-sm text-blue-600 font-medium">
                {user.name}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                @{user.username}
              </span>
            </>
          )}
        </div>
        
        <Link href={`/posts/${id}`} className="btn btn-primary">
          Read More
        </Link>
      </div>
    </div>
  );
}
