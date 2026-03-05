export interface PostLike {
  id: string;
  created_at: string;
  postId: string;
  userId: string;
}
export interface CreatePostLike {
  userId?: string | undefined;
  postId?: string;
}
