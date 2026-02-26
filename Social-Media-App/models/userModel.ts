import * as ImagePicker from "expo-image-picker";
export interface User {
  id: string;
  email?: string;
  name?: string;
  address?: string;
  image?: string | ImagePicker.ImagePickerAsset | null;
  bio?: string;
  phoneNumber?: string;
}
export type UpdateUserResponse =
  | { success: true; data: Partial<User> }
  | { success: false; msg: string };
