export interface UserEntity {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: Record<string, unknown>;
  address: Record<string, unknown>;
}