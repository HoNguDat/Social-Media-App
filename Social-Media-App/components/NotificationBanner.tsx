import { notificationUIConfigs } from "@/constants/notification";
import { playNotificationSound } from "@/helpers/sound";
import { BlurView } from "expo-blur";
import React from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { initialWindowMetrics } from "react-native-safe-area-context";

interface NotificationPayload {
  title: string;
  body?: string;
  userName?: string;
  userAvatar?: string;
  postId?: string | number;
  onPress?: () => void;
}

const safeTop = initialWindowMetrics?.insets?.top ?? 20;
const dynamicMarginTop = Platform.OS === "ios" ? safeTop : safeTop + 10;

export const showNotificationBanner = (data: NotificationPayload) => {
  playNotificationSound();

  const config = notificationUIConfigs[
    data.title as keyof typeof notificationUIConfigs
  ] || { label: data.title };

  const fullMessage = `${config.label}`;

  showMessage({
    message: "",
    description: "",
    duration: 4000,
    floating: true,
    position: "top",
    style: styles.flashMessageStyle,
    renderCustomContent: () => (
      <BlurView intensity={80} tint="dark" style={styles.blurView}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.appIcon}
        />

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Thông báo</Text>
            <Text style={styles.timeText}>now</Text>
          </View>

          <Text numberOfLines={2} style={styles.messageContainer}>
            <Text style={styles.userNameText}>{data.userName} </Text>
            <Text style={styles.fullMessageText}>{fullMessage}</Text>
          </Text>
        </View>
      </BlurView>
    ),
    onPress: data.onPress,
  });
};

const styles = StyleSheet.create({
  flashMessageStyle: {
    backgroundColor: "transparent",
    paddingTop: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  blurView: {
    borderRadius: 22,
    marginHorizontal: 8,
    marginTop: dynamicMarginTop,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#ccc",
    fontWeight: "600",
    fontSize: 13,
  },
  timeText: {
    color: "#ccc",
    fontSize: 12,
  },
  messageContainer: {
    marginTop: 2,
    lineHeight: 18,
  },
  userNameText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  fullMessageText: {
    color: "#ddd",
    fontSize: 14,
    fontWeight: "400",
  },
});
