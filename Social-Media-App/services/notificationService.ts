import { NotificationType } from "@/constants/notification";
import { supabase } from "@/lib/supabase";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(userId: string) {
  if (!Device.isDevice) return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "0826b524-d2d2-45e8-a979-d1f04e4c7c72",
    })
  ).data;

  if (token) {
    await supabase
      .from("users")
      .update({ expo_push_token: token })
      .eq("id", userId);
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
export const fetchNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        sender:senderId(id, name, image)
      `,
      )
      .eq("receiverId", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
export const createNotification = async ({
  receiverId,
  senderId,
  title,
  data,
}: {
  receiverId: string;
  senderId: string;
  title: NotificationType;
  data: any;
}) => {
  try {
    const { error } = await supabase.from("notifications").insert({
      receiverId,
      senderId,
      title,
      data: JSON.stringify(data),
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
export const updateNotificationStatus = async (notificationId: string) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ isRead: true })
      .eq("id", notificationId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
export const deleteNotification = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
