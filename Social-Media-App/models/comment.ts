export interface Comment {
  id?: number;
  created_at?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    image: string;
  };
  postId?: number;
  text: string;
  count?: number;
}
