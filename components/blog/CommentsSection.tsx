'use client';

import { useState, useEffect } from 'react';
import type { Comment, CommentsSectionProps, NewComment } from '@/types';

export default function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<NewComment>({
    name: '',
    email: '',
    body: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load additional comments from localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem(`post_${postId}_comments`);
    if (savedComments) {
      try {
        const parsed = JSON.parse(savedComments);
        setComments((prev) => [...prev, ...parsed]);
      } catch (error) {
        console.error('Error loading saved comments:', error);
      }
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.name.trim() || !newComment.email.trim() || !newComment.body.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Create new comment object
    const comment: Comment = {
      id: Date.now(), // Temporary ID
      postId,
      name: newComment.name.trim(),
      email: newComment.email.trim(),
      body: newComment.body.trim(),
    };

    // Save to localStorage
    const savedComments = localStorage.getItem(`post_${postId}_comments`);
    const existingComments = savedComments ? JSON.parse(savedComments) : [];
    existingComments.push(comment);
    localStorage.setItem(`post_${postId}_comments`, JSON.stringify(existingComments));

    // Add to state
    setComments((prev) => [...prev, comment]);

    // Reset form
    setNewComment({ name: '', email: '', body: '' });
    setIsSubmitting(false);

    // Scroll to new comment
    setTimeout(() => {
      const element = document.getElementById(`comment-${comment.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 uppercase tracking-wide">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {/* Comments List - Show first */}
      {comments.length > 0 && (
        <div className="space-y-6 mb-12">
          {comments.map((comment) => {
            const hasAvatar = comment.email.includes('@');
            const displayName = comment.name || 'Anonymous';
            const commentDate = new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {hasAvatar ? (
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.email}`}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-brand-purple-600 font-semibold text-lg">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{displayName}</h4>
                      {hasAvatar && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{commentDate}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">{comment.body}</p>
                <button className="text-sm text-brand-purple-600 hover:text-brand-purple-700 font-medium">
                  Reply
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Comment Form */}
      {!showForm ? (
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <p className="text-sm text-gray-600 mb-4">
            To leave a comment, click the button below to sign in with Google.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            SIGN IN WITH GOOGLE
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              id="comment-name"
              type="text"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent outline-none"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="comment-email"
              type="email"
              value={newComment.email}
              onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent outline-none"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="comment-body" className="block text-sm font-medium text-gray-700 mb-2">
              Comment *
            </label>
            <textarea
              id="comment-body"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-purple-500 focus:border-transparent outline-none resize-none"
              placeholder="Write your comment here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
        </div>
      )}
    </section>
  );
}

