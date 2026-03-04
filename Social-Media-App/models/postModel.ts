import { MediaFile } from "./mediaFile";
import { User } from "./userModel";

export interface Post {
  id?: string;
  body?: string;
  file?: MediaFile | null;
  userId?: string;
  created_at?: string;
  user?: User;
}
