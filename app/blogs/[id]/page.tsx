import Link from 'next/link';
import Image from 'next/image';
import {
  fetchPost,
  fetchUser,
  fetchComments,
  getPostThumbnail,
  getUserAvatar,
} from '@/lib/api';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, HeartIcon, ShareIcon } from '@/components/svgs';

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const postId = parseInt(params.id, 10);

  if (isNaN(postId)) {
    notFound();
  }

  try {
    const [post, comments] = await Promise.all([
      fetchPost(postId),
      fetchComments(postId),
    ]);

    if (!post) {
      notFound();
    }

    const user = await fetchUser(post.userId);
    const postThumbnail = getPostThumbnail(postId);
    const userAvatar = getUserAvatar(user?.id!);

    // Generate reading time
    const readingTime = Math.ceil(post.body.split(' ').length / 200);
    const publishDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <main className="blogs">
        {/* Back Button */}
        <div className="blogs__detail-back">
          <div className="container">
            <Link href="/blogs" className="blogs__back-link">
              <ArrowLeftIcon width={20} height={20} />
              <span>Back to blogs</span>
            </Link>
          </div>
        </div>

        {/* Hero Header Section */}
        <div className="blogs__detail-hero">
          <div className="container">
            <div className="blogs__detail-header">
              {/* Breadcrumb / Category */}
              <div className="blogs__detail-breadcrumb">
                <span className="blogs__detail-badge">Blog Post</span>
              </div>

              {/* Main Title */}
              <h1 className="blogs__detail-title">{post.title}</h1>

              {/* Meta Information */}
              <div className="blogs__detail-meta-container">
                {/* Author Info */}
                {user && (
                  <div className="blogs__detail-author-info">
                    <Image
                      src={userAvatar}
                      alt={user.name}
                      width={56}
                      height={56}
                      className="blogs__detail-author-avatar"
                    />
                    <div className="blogs__detail-author-text">
                      <p className="blogs__detail-author-label">Written by</p>
                      <p className="blogs__detail-author-name">{user.name}</p>
                      <div className="blogs__detail-meta-items">
                        <span className="blogs__detail-meta-separator">•</span>
                        <span className="blogs__detail-meta-item">
                          {readingTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="blogs__detail-actions">
                  <button
                    className="blogs__detail-action-btn"
                    aria-label="Like post"
                    title="Like this post"
                  >
                    <HeartIcon width={20} height={20} />
                    <span>Like</span>
                  </button>
                  <button
                    className="blogs__detail-action-btn"
                    aria-label="Share post"
                    title="Share this post"
                  >
                    <ShareIcon width={20} height={20} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="blogs__detail-featured-image">
          <Image
            src={postThumbnail}
            alt={post.title}
            width={1200}
            height={600}
            priority
            className="blogs__detail-image"
          />
        </div>

        {/* Content Section */}
        <div className="blogs__detail-content-wrapper">
          <div className="container">
            <div className="blogs__detail-content">
              {/* Post Body */}
              <article className="blogs__detail-body">
                <div className="blogs__detail-text">
                  <p>{post.body}</p>
                </div>
              </article>

              {/* Divider */}
              <div className="blogs__detail-divider"></div>

              {/* Comments Section */}
              <section className="blogs__detail-comments">
                <h2 className="blogs__detail-comments-title">
                  Comments{' '}
                  <span className="blogs__detail-comments-count">
                    ({comments.length})
                  </span>
                </h2>

                {comments.length > 0 ? (
                  <div className="blogs__detail-comments-list">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="blogs__detail-comment-item"
                      >
                        <div className="blogs__detail-comment-header">
                          <div>
                            <h3 className="blogs__detail-comment-name">
                              {comment.name}
                            </h3>
                            <p className="blogs__detail-comment-email">
                              {comment.email}
                            </p>
                          </div>
                        </div>
                        <p className="blogs__detail-comment-text">
                          {comment.body}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="blogs__detail-no-comments">
                    <p className="blogs__detail-no-comments-title">
                      No comments yet
                    </p>
                    <p className="blogs__detail-no-comments-subtitle">
                      Be the first to share your thoughts!
                    </p>
                  </div>
                )}
              </section>

              {/* CTA Section */}
              <div className="blogs__detail-cta">
                <Link href="/blogs" className="blogs__detail-cta-btn">
                  <ArrowLeftIcon width={20} height={20} />
                  <span>Read More Posts</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="blogs">
        <div className="blogs__detail-error">
          <div className="container">
            <div className="blogs__detail-error-content">
              <h1 className="blogs__detail-error-title">Oops!</h1>
              <p className="blogs__detail-error-subtitle">
                Something went wrong
              </p>
              <p className="blogs__detail-error-message">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
              <Link href="/blogs" className="blogs__detail-cta-btn">
                <ArrowLeftIcon width={20} height={20} />
                <span>Back to Blogs</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
