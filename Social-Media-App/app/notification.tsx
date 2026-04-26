import Icon from "@/assets/icons";
import BottomTab from "@/components/BottomTab";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import { useScrollTabAnimation } from "@/hooks/useScrollTabAnimation";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 1. Dữ liệu giả (Mock Data)
const mockNotifications = [
  {
    id: "1",
    sender: {
      name: "Trần Anh Tuấn",
      avatar: "https://i.pravatar.cc/150?u=tuan",
    },
    content: "đã thích bài viết của bạn: 'Học React Native thật thú vị!'",
    type: "like",
    createdAt: "5 phút trước",
    read: false,
  },
  {
    id: "2",
    sender: {
      name: "Nguyễn Thùy Chi",
      avatar: "https://i.pravatar.cc/150?u=chi",
    },
    content: "đã bình luận: 'App này nhìn xịn quá bạn ơi 😍'",
    type: "comment",
    createdAt: "2 giờ trước",
    read: false,
  },
  {
    id: "3",
    sender: {
      name: "PureHub Community",
      avatar: null,
    },
    content:
      "chào mừng bạn đã tham gia cộng đồng PureHub! Hãy tạo bài viết đầu tiên.",
    type: "system",
    createdAt: "1 ngày trước",
    read: true,
  },
  {
    id: "4",
    sender: {
      name: "Lê Minh",
      avatar: "https://i.pravatar.cc/150?u=minh",
    },
    content: "đã bắt đầu theo dõi bạn.",
    type: "follow",
    createdAt: "3 ngày trước",
    read: true,
  },
  {
    id: "5",
    sender: {
      name: "Lê Minh",
      avatar: "https://i.pravatar.cc/150?u=minh",
    },
    content: "đã bắt đầu theo dõi bạn.",
    type: "follow",
    createdAt: "3 ngày trước",
    read: true,
  },
  {
    id: "6",
    sender: {
      name: "Lê Minh",
      avatar: "https://i.pravatar.cc/150?u=minh",
    },
    content: "đã bắt đầu theo dõi bạn.",
    type: "follow",
    createdAt: "3 ngày trước",
    read: true,
  },
  {
    id: "7",
    sender: {
      name: "Lê Minh",
      avatar: "https://i.pravatar.cc/150?u=minh",
    },
    content: "đã bắt đầu theo dõi bạn.",
    type: "follow",
    createdAt: "3 ngày trước",
    read: true,
  },
  {
    id: "8",
    sender: {
      name: "Lê Minh",
      avatar: "https://i.pravatar.cc/150?u=minh",
    },
    content: "đã bắt đầu theo dõi bạn.",
    type: "follow",
    createdAt: "3 ngày trước",
    read: true,
  },
  {
    id: "9",
    sender: {
      name: "Lê Minh",
      avatar: "https://i.pravatar.cc/150?u=minh",
    },
    content: "đã bắt đầu theo dõi bạn.",
    type: "follow",
    createdAt: "3 ngày trước",
    read: true,
  },
  {
    id: "10",
    sender: {
      name: "Lê Minh",
      avatar: "https://i.pravatar.cc/150?u=minh",
    },
    content: "đã bắt đầu theo dõi bạn.",
    type: "follow",
    createdAt: "3 ngày trước",
    read: true,
  },
];

const Notifications = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { translateY, scrollHandler } = useScrollTabAnimation();
  const renderItem = ({ item }: { item: (typeof mockNotifications)[0] }) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer, !item.read && styles.unreadBg]}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={
              item.sender.avatar
                ? { uri: item.sender.avatar }
                : require("../assets/images/defaultUser.png") // Bạn hãy kiểm tra lại path ảnh này
            }
            style={styles.avatar}
          />
          {/* Badge icon loại thông báo */}
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(item.type) },
            ]}
          >
            {item.type === "like" && (
              <Icon name="heart" size={10} color="white" fill="white" />
            )}
            {item.type === "comment" && (
              <Icon name="comment" size={10} color="white" fill="white" />
            )}
            {item.type === "follow" && (
              <Icon name="user" size={10} color="white" />
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.contentText} numberOfLines={3}>
            <Text style={styles.userName}>{item.sender.name}</Text>{" "}
            {item.content}
          </Text>
          <Text style={styles.timeText}>{item.createdAt}</Text>
        </View>

        {/* Chấm xanh báo hiệu chưa đọc */}
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "like":
        return "#FF4D4D";
      case "comment":
        return "#4A7BFF";
      case "follow":
        return "#22C1C3";
      default:
        return theme.colors.textLight;
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.background}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Icon
              name="arrowLeft"
              strokeWidth={2.5}
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Thông báo</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={mockNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
            </View>
          }
        />
      </View>
      <BottomTab translateY={translateY} user={currentUser} />
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  backButton: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: hp(2.8),
    fontWeight: theme.fonts.bold as any,
    color: theme.colors.text,
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(5),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(3),
    borderRadius: 20,
    marginBottom: hp(1.5),
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  unreadBg: {
    backgroundColor: "#E0F2FE", // Màu xanh dương pha trắng bạn thích
    borderColor: "#BAE6FD",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: hp(6),
    height: hp(6),
    borderRadius: 100,
    backgroundColor: theme.colors.gray,
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
    fontWeight: theme.fonts.bold as any,
    color: theme.colors.text,
    fontSize: hp(1.7),
  },
  contentText: {
    fontSize: hp(1.6),
    color: theme.colors.textDark,
    lineHeight: hp(2.1),
  },
  timeText: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4A7BFF",
    marginLeft: wp(2),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: hp(20),
  },
  emptyText: {
    fontSize: hp(1.8),
    color: theme.colors.textLight,
  },
});
