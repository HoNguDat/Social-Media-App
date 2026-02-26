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
