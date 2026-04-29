import Icon from "@/assets/icons";
import Header from "@/components/Header";
import { renderRightActions } from "@/components/RenderRightActions";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  NOTIFICATION_TYPES,
  NotificationType,
  notificationUIConfigs,
} from "@/constants/notification";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { getFormattedDate } from "@/helpers/dateFormat";
import {
  fetchNotifications,
  updateNotificationStatus,
} from "@/services/notificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const Notifications = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => fetchNotifications(user?.id as string),
    enabled: !!user?.id,
  });
  const { mutate } = useMutation({
    mutationFn: updateNotificationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
  });

  const handlePress = (item: any, config: any, extraData: any) => {
    if (!item.isRead) {
      mutate(item.id);
    }

    router.push({
      pathname: config.route as any,
      params: {
        postId: extraData?.postId,
        userId: item.senderId,
      },
    });
  };
  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const config =
        notificationUIConfigs[item.title as NotificationType] ??
        notificationUIConfigs[NOTIFICATION_TYPES.LIKE_POST]!;
      const extraData =
        typeof item.data === "string" ? JSON.parse(item.data) : item.data;
      const isDarkMode = theme.colors.background === "#121212";

      const unreadBg = isDarkMode ? "#1A1A1A" : "#E7F9F1";
      const readBg = theme.colors.surface;

      return (
        <View style={styles.swipeableWrapper}>
          <ReanimatedSwipeable
            friction={2}
            rightThreshold={40}
            renderRightActions={(progess, drag) =>
              renderRightActions(progess, drag, item.id)
            }
          >
            <TouchableOpacity
              style={[
                styles.itemContainer,
                {
                  backgroundColor: item.isRead ? readBg : unreadBg,
                  borderColor: item.isRead
                    ? theme.colors.gray
                    : theme.colors.primary + "40",
                  borderRadius: theme.radius.xxl,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => handlePress(item, config, extraData)}
            >
              <View style={styles.avatarContainer}>
                <Image
                  source={
                    item.sender?.image
                      ? { uri: item.sender.image }
                      : require("../../../assets/images/defaultUser.png")
                  }
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.gray },
                  ]}
                />
                <View
                  style={[styles.typeBadge, { backgroundColor: config.color }]}
                >
                  <Icon
                    name={config.icon as any}
                    size={10}
                    color="white"
                    fill="white"
                  />
                </View>
              </View>

              <View style={styles.content}>
                <Text
                  style={[styles.contentText, { color: theme.colors.textDark }]}
                  numberOfLines={3}
                >
                  <Text
                    style={[
                      styles.userName,
                      {
                        color: theme.colors.text,
                        fontWeight: theme.fonts.bold,
                      },
                    ]}
                  >
                    {item.sender?.name || "Người dùng PureHub"}
                  </Text>{" "}
                  {config.label}
                </Text>
                <Text
                  style={[styles.timeText, { color: theme.colors.textLight }]}
                >
                  {getFormattedDate(item.created_at)}
                </Text>
              </View>

              {!item.isRead && (
                <View
                  style={[
                    styles.unreadDot,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          </ReanimatedSwipeable>
        </View>
      );
    },
    [theme],
  );

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.container}>
        <Header title="Thông báo" showBackButton={true} />
        {isLoading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={notifications?.data || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text
                  style={[styles.emptyText, { color: theme.colors.textLight }]}
                >
                  Chưa có thông báo nào
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(2),
  },
  listContent: {
    paddingBottom: hp(5),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(2),
    marginBottom: hp(1.5),
    borderWidth: 1,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: hp(6),
    height: hp(6),
    borderRadius: 100,
  },
  typeBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  content: {
    flex: 1,
    marginLeft: wp(3),
    gap: 2,
  },
  userName: {
    fontSize: hp(1.7),
  },
  contentText: {
    fontSize: hp(1.6),
    lineHeight: hp(2.1),
  },
  timeText: {
    fontSize: hp(1.4),
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: wp(2),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: hp(20),
  },
  emptyText: {
    fontSize: hp(1.8),
  },
  swipeableWrapper: {
    marginBottom: hp(1.5), // Đưa margin ra ngoài cùng
  },

  deleteButton: {
    backgroundColor: "#ef4444", // Màu đỏ
    width: 70,
    height: "100%", // Cao bằng item
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    marginLeft: -2, // Ép sát vào item
  },
});
