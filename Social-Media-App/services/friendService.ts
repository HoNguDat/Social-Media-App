import { supabase } from "@/lib/supabase";

export const fetchFriendRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
      id,
      created_at,
      sender:senderId(id, name, image) 
    `,
    )
    .eq("receiverId", userId)
    .eq("status", "pending");
  return { success: !error, data };
};

export const fetchAcceptedFriends = async (userId: string) => {
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
      id,
      created_at,
      sender:senderId(id, name, image),
      receiver:receiverId(id, name, image)
    `,
    )
    .or(`senderId.eq.${userId},receiverId.eq.${userId}`)
    .eq("status", "accepted");

  return { success: !error, data };
};

export const respondToRequest = async (
  requestId: string,
  status: "accepted" | "deleted",
) => {
  if (status === "deleted") {
    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("id", requestId);
    return { success: !error };
  }
  const { error } = await supabase
    .from("friends")
    .update({ status: "accepted" })
    .eq("id", requestId);
  return { success: !error };
};

export const getFriendshipStatus = async (userId: string, targetId: string) => {
  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .or(
      `and(senderId.eq.${userId},receiverId.eq.${targetId}),and(senderId.eq.${targetId},receiverId.eq.${userId})`,
    )
    .single();
  return { success: !error, data };
};

export const sendFriendRequest = async (
  senderId: string,
  receiverId: string,
) => {
  const { data, error } = await supabase
    .from("friends")
    .insert({ senderId, receiverId, status: "pending" });
  return { success: !error, data };
};

export const cancelFriendRequest = async (
  senderId: string,
  receiverId: string,
) => {
  const { error } = await supabase
    .from("friends")
    .delete()
    .or(
      `and(senderId.eq.${senderId},receiverId.eq.${receiverId}),and(senderId.eq.${receiverId},receiverId.eq.${senderId})`,
    );

  return { success: !error };
};
