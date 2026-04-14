import { supabase } from "@/lib/supabase";
import { Comment } from "@/models/comment";
import { deleteFile, uploadFile, uploadVideo } from "./fileService";

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
        postLikes(*),
        comments(count)`,
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
export const fetchPostDetails = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*,user: users(id, name, image),
        postLikes(*),
        comments(*,user:users(id,name,image))`,
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();
    if (error) {
      console.log("Fetchs post details error: ", error);
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Fetchs post details error:", error);
    return {
      success: false,
      msg: "An error occurred while fetching post details data",
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
export const removePostLike = async (postId: number, userId: string) => {
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
  post: any,
): Promise<ServiceResponse> => {
  try {
    if (post.id) {
      const { data: oldPost } = await supabase
        .from("posts")
        .select("file")
        .eq("id", post.id)
        .single();

      const isFileChanged = post.file !== oldPost?.file;
      if (oldPost?.file && isFileChanged) {
        await deleteFile(oldPost.file);
      }
    }

    if (post.file && typeof post.file === "object") {
      const isImage = post.file.type === "image";
      const folderName = isImage ? "postImages" : "postVideos";

      let fileResult = isImage
        ? await uploadFile(folderName, post.file, true)
        : await uploadVideo(folderName, post.file);

      if (fileResult.success) {
        post.file = fileResult.publicUrl;
      } else {
        return fileResult;
      }
    }
    const { comments, user, postLikes, ...dataToUpload } = post;
    const { data, error } = await supabase
      .from("posts")
      .upsert(dataToUpload)
      .select()
      .single();

    if (error) return { success: false, msg: "Could not save post" };
    return { success: true, data: data };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
export const createComment = async (comment: Comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log("Comment error ", error);
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("Comment error ", error);
    return {
      success: false,
      msg: "An error occurred while comment ",
    };
  }
};
export const removeComment = async (commentId: number) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("Remove comment error ", error);
      return { success: false, msg: error.message };
    }
    return { success: true, data: { commentId } };
  } catch (error) {
    console.log("Remove comment error", error);
    return {
      success: false,
      msg: "An error occurred while remove comment ",
    };
  }
};
export const removePost = async (postId: number) => {
  try {
    // 1. Lấy thông tin post trước khi xóa để biết nó có file không
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("file")
      .eq("id", postId)
      .single();

    if (fetchError) throw fetchError;

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      return { success: false, msg: deleteError.message };
    }

    if (post && post.file) {
      await deleteFile(post.file);
    }

    return { success: true, data: { postId } };
  } catch (error: any) {
    console.log("removePost error: ", error);
    return { success: false, msg: error.message };
  }
};
