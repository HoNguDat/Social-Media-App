import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const mockRequests = [
  {
    id: "1",
    name: "Nguyễn Gia Thụ",
    avatar: "https://i.pravatar.cc/150?img=1",
    mutualFriends: 0,
    time: "1 tuần",
  },
  {
    id: "2",
    name: "Trịnh Trần Phương Tuấn",
    avatar: "https://i.pravatar.cc/150?img=2",
    mutualFriends: 5,
    time: "38 tuần",
  },
  {
    id: "3",
    name: "Phùng Thanh Độ",
    avatar: "https://i.pravatar.cc/150?img=3",
    mutualFriends: 7,
    time: "21 tuần",
  },
];

const FriendRequest = () => {
  const { theme } = useTheme();

  const renderItem = ({ item }: any) => (
    <View style={styles.requestItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <View style={styles.info}>
        {/* Hàng chứa Tên và Thời gian */}
        <View style={styles.nameRow}>
          <Text
            style={[styles.name, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        {/* Hàng chứa Nút bấm */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.confirmBtn}>
            <Text style={styles.confirmText}>Xác nhận</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.container}>
        <Header title="Bạn bè" showBackButton />

        {/* Section Header giống Facebook */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Lời mời kết bạn
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </ScreenWrapper>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(2),
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(2),
    marginBottom: hp(2),
  },

  sectionTitle: {
    fontSize: wp(5),
    fontWeight: "bold",
  },

  seeAllText: {
    fontSize: wp(4),
    color: "#2D88FF",
    fontWeight: "400",
  },

  requestItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  avatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    marginRight: wp(3),
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: wp(4.2),
    fontWeight: "600",
    flex: 1,
  },

  timeText: {
    fontSize: wp(3.5),
    color: "#8E8E93",
    marginLeft: wp(2),
  },

  mutual: {
    fontSize: wp(3.5),
    marginTop: 2,
    marginBottom: 4,
  },

  emptyMutual: {
    height: wp(4),
  },

  actions: {
    flexDirection: "row",
    marginTop: hp(1),
  },

  confirmBtn: {
    flex: 1,
    backgroundColor: "#1877F2",
    paddingVertical: hp(1),
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },

  confirmText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: wp(3.8),
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: "#3A3B3C",
    paddingVertical: hp(1),
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteText: {
    color: "#E4E6EB",
    fontWeight: "600",
    fontSize: wp(3.8),
  },

  separator: {
    height: hp(2.5),
  },
});
