import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import BottomTab from "@/components/BottomTab";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import { useScrollTabAnimation } from "@/hooks/useScrollTabAnimation";
import { AuthService } from "@/services/authService";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { translateY, scrollHandler } = useScrollTabAnimation();

  const onLogout = async () => {
    try {
      await AuthService.signOut();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: onLogout },
    ]);
  };

  if (!user) return null;

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1 }}>
        {/* --- Phần Header đã sửa lỗi đè nút --- */}
        <View style={styles.headerRow}>
          {/* Header này sẽ tự lo nút Back bên trái và Title ở giữa */}
          <Header title="Profile" mb={0} />

          {/* Nút Logout nằm độc lập ở góc phải */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name={"logout"} color={theme.colors.rose} size={hp(2.5)} />
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={{ gap: 25 }}>
            {/* Avatar Section */}
            <View style={styles.avatarContainer}>
              <Avatar
                uri={
                  typeof user?.image === "string"
                    ? user.image
                    : user?.image?.uri || ""
                }
                size={hp(12)}
                rounded={theme.radius.xxl * 1.4}
              />
              <Pressable
                style={styles.editIcon}
                onPress={() => router.push("/editProfile")}
              >
                <Icon name={"edit"} size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            {/* Name & Address */}
            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.infoText}>
                {user?.address || "No address updated"}
              </Text>
            </View>

            {/* Details Box */}
            <View style={styles.detailsBox}>
              <View style={styles.infoItem}>
                <Icon name={"mail"} size={20} color={theme.colors.textLight} />
                <Text style={styles.infoText}>{user?.email}</Text>
              </View>

              {user?.phoneNumber && (
                <View style={styles.infoItem}>
                  <Icon
                    name={"call"}
                    size={20}
                    color={theme.colors.textLight}
                  />
                  <Text style={styles.infoText}>{user.phoneNumber}</Text>
                </View>
              )}

              {user?.bio && (
                <View style={styles.bioContainer}>
                  <Text style={styles.bioText}>{user.bio}</Text>
                </View>
              )}
            </View>

            {/* My Posts Placeholder */}
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.userName, { fontSize: hp(2.2) }]}>
                My Posts
              </Text>
              <View style={styles.noPostsContainer}>
                <Text style={styles.infoText}>No posts yet</Text>
              </View>
            </View>
          </View>
        </Animated.ScrollView>

        <BottomTab translateY={translateY} user={user} />
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  headerRow: {
    // Để Header chiếm trọn chiều ngang
    width: "100%",
    paddingHorizontal: wp(4),
    // Position relative để làm mốc cho nút Logout absolute
    position: "relative",
    justifyContent: "center",
    height: hp(6), // Đặt chiều cao cố định để căn chỉnh nút Logout mượt hơn
  },
  logoutButton: {
    position: "absolute",
    right: wp(4),
    // Căn giữa nút Logout theo chiều dọc của Header
    top: "50%",
    marginTop: -hp(2), // Căn chỉnh lại dựa trên kích thước nút
    padding: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
    zIndex: 10, // Đảm bảo nó luôn nằm trên cùng để bấm được
  },
  contentContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(15),
    paddingTop: 20,
  },
  avatarContainer: {
    height: hp(12),
    width: hp(12),
    alignSelf: "center",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -8,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  userName: {
    fontSize: hp(2.8),
    fontWeight: "600",
    color: theme.colors.textDark,
  },
  detailsBox: {
    gap: 15,
    backgroundColor: theme.colors.gray || "#f9f9f9",
    padding: 20,
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: "#efefef",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: hp(1.7),
    fontWeight: "500",
    color: theme.colors.textLight,
  },
  bioContainer: {
    marginTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    paddingTop: 15,
  },
  bioText: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    lineHeight: hp(2.2),
  },
  noPostsContainer: {
    height: hp(15),
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: theme.radius.lg,
    marginTop: 10,
  },
});
