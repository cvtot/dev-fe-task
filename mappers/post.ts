// mappers/post.mapper.ts
import { PostEntity } from "@/entities/post"; 
import { PostModel } from "@/models/post"; 

export const mapPostToModel = (post: PostEntity): PostModel => {
  return {
    id: post.id,
    imageUrl: post.thumbnail,
    category: post.tags?.[0] || "General",
    title: post.title,
    description: post.body,
    user: {
      name: post.user?.name || "Anonymous",
      avatarUrl: `https://i.pravatar.cc/100?u=${encodeURIComponent(post.user?.email ?? "")}`,
      date: post.publishedAt,
    },
  };
};
