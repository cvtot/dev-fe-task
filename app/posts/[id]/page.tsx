import Link from "next/link";
import { fetchPost, fetchUser, fetchComments } from "@/lib/api";
import { notFound } from "next/navigation";

interface PostDetailPageProps {
  params: { id: string };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const postId = parseInt(params.id, 10);
  if (isNaN(postId)) notFound();

  try {
    const [post, comments] = await Promise.all([
      fetchPost(postId),
      fetchComments(postId),
    ]);

    if (!post) notFound();
    const user = await fetchUser(post.userId);

    return (
      <div className="post-detail max-w-4xl mx-auto px-4 py-12">
        {/* ===== Back Button ===== */}
        <div className="mb-10">
          <Link
            href="/posts"
            className="inline-flex items-center text-purple-700 hover:text-purple-900 font-medium transition"
          >
            ← Back to Posts
          </Link>
        </div>

        {/* ===== Post Card ===== */}
        <article
          className="bg-white rounded-2xl shadow-[0_4px_6px_-2px_rgba(16,24,40,0.08),_0_12px_16px_-4px_rgba(16,24,40,0.14)] p-8 mb-12"
        >
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author Info */}
          {user && (
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email}
                  {user.website && (
                    <>
                      {" • "}
                      <a
                        href={`https://${user.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {user.website}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="prose prose-lg text-gray-700 max-w-none leading-relaxed">
            {post.body.split("\n").map((para, i) => (
              <p key={i} className="mb-4">
                {para}
              </p>
            ))}
          </div>
        </article>

        {/* ===== Comments Section ===== */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            💬 Comments ({comments.length})
          </h2>

          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-xl shadow-[0_4px_6px_-2px_rgba(16,24,40,0.08),_0_12px_16px_-4px_rgba(16,24,40,0.14)] p-5 transition hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {comment.name}
                      </h3>
                      <p className="text-sm text-gray-600">{comment.email}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 border border-dashed rounded-xl bg-gray-50">
              <p>No comments yet. Be the first to reply 👀</p>
            </div>
          )}
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h3 className="text-xl font-semibold mb-4 text-red-600">
          Error Loading Post
        </h3>
        <p className="text-gray-600 mb-4">
          Sorry, we couldn’t load this post. Please try again later.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
        <Link
          href="/posts"
          className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Back to Posts
        </Link>
      </div>
    );
  }
}
