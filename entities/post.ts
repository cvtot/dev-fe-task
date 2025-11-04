import { UserEntity } from "./user";

export interface PostEntity {
  userId: number;
  id: number;
  title: string;
  body: string;
  coverImage: string;
  thumbnail: string;
  readTime: number;
  tags: string[];
  publishedAt: string;
  user?: UserEntity;
}
