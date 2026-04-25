import { supabase } from "@/lib/supabase";
import { UpdateUserResponse, User } from "@/models/userModel";

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      msg: "An error occurred while fetching user data",
    };
  }
};
export const updateUser = async (
  userId: string,
  data: Partial<User>,
): Promise<UpdateUserResponse> => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);
    if (error) {
      return {
        success: false,
        msg: error.message,
      };
    }
    return {
      success: true,

      data,
    };
  } catch (error: any) {
    console.log("got error:", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const searchUsers = async (
  query: string,
  currentUserId: string,
  page: number = 1,
) => {
  try {
    if (!query.trim()) {
      return { success: true, data: [], nextPage: null };
    }

    const LIMIT = 20;
    const from = (page - 1) * LIMIT;
    const to = from + LIMIT - 1;

    const { data, error } = await supabase
      .from("users")
      .select("id, name, image, bio")
      .ilike("name", `%${query}%`)
      .neq("id", currentUserId)
      .range(from, to);

    if (error) {
      console.error("searchUsers Error: ", error);
      return { success: false, msg: "Không thể tìm kiếm người dùng" };
    }

    return {
      success: true,
      data,
      nextPage: data.length === LIMIT ? page + 1 : null,
    };
  } catch (error) {
    console.error("searchUsers Catch: ", error);
    return { success: false, msg: "Đã có lỗi xảy ra" };
  }
};
