import { supabase } from "@/lib/supabase";
import { Post } from "@/models/postModel";
import { uploadFile, uploadVideo } from "./imageService";

type ServiceResponse = {
  success: boolean;
  data?: any;
  msg?: string;
};
export const fetchPosts = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*,user: users(id, name, image),
        postLikes(*)`,
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.log("Fetchs error: ", error);
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Fetchs error: ", error);
    return {
      success: false,
      msg: "An error occurred while fetching posts data",
    };
  }
};
export const createPostLike = async (postLike: any) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("Post like error ", error);
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Post like error ", error);
    return {
      success: false,
      msg: "An error occurred while like post ",
    };
  }
};
export const removePostLike = async (postId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("Remove post like error ", error);
      return { success: false, msg: error.message };
    }
    return { success: true };
  } catch (error) {
    console.log("Remove post like error", error);
    return {
      success: false,
      msg: "An error occurred while remove post like ",
    };
  }
};

export const createOrUpdatePost = async (
  post: Post,
): Promise<ServiceResponse> => {
  try {
    if (post.file && typeof post.file === "object") {
      const isImage = post.file.type === "image";
      const folderName = isImage ? "postImages" : "postVideos";

      let fileResult;

      if (isImage) {
        fileResult = await uploadFile(folderName, post.file, true);
      } else {
        fileResult = await uploadVideo(folderName, post.file);
      }
      if (fileResult.success) {
        post.file = fileResult.publicUrl;
      } else {
        return fileResult;
      }
    }
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("createPost error:", error);
      return { success: false, msg: "Could not create your post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("createPost error:", error);
    return { success: false, msg: "Could not create your post" };
  }
};
