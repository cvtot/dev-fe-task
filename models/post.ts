export interface AuthorModel {
  name: string;
  avatarUrl: string;
  date: string;
}

export interface PostModel {
  id: number;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  user: AuthorModel;
}
