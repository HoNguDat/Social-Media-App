import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
interface UploadResult {
  success: boolean;

  msg?: string;

  filePath?: string;

  publicUrl?: string;
}

export const getUserImageSrc = (image: string | ImagePickerAsset | null) => {
  if (!image) {
    return require("../assets/images/defaultUser.png");
  }

  if (typeof image === "string") {
    return { uri: image };
  }

  if ("uri" in image) {
    return { uri: image.uri };
  }

  return require("../assets/images/defaultUser.png");
};
export const uploadFile = async (
  folderName: string,
  asset: ImagePicker.ImagePickerAsset,
  isImage: boolean = true,
): Promise<UploadResult> => {
  try {
    if (!asset.uri) {
      return {
        success: false,
        msg: "No file uri",
      };
    }
    const fileName = getFilePath(folderName, isImage);
    const response = await fetch(asset.uri);
    const arrayBuffer = await response.arrayBuffer();
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, arrayBuffer, {
        contentType: asset.mimeType || "image/jpeg",
      });
    console.log("UPLOAD DATA:", data);
    console.log("UPLOAD ERROR:", error);
    console.log("FILE NAME:", fileName);
    console.log("arrayBuffer:", arrayBuffer);
    if (error) {
      console.log("Supabase error:", error);

      return {
        success: false,
        msg: error.message,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    return {
      success: true,
      filePath: fileName,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error: any) {
    console.log("upload error:", error);

    return {
      success: false,
      msg: error.message,
    };
  }
};
export const getFilePath = (
  folderName: string,

  isImage: boolean,
): string => {
  const extension = isImage ? ".png" : ".mp4";

  return `${folderName}/${Date.now()}${extension}`;
};
