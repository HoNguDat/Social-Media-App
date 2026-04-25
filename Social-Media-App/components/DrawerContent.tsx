import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import { AuthService } from "@/services/authService";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const DrawerContent = (props: any) => {
  const { user } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const onLogout = async () => {
    try {
      await AuthService.signOut();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (!user) return null;
  const MenuItem = ({ icon, label, onPress }: any) => (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: pressed ? theme.colors.gray : "transparent" },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.03)",
          },
        ]}
      >
        <Icon
          name={icon}
          size={hp(2.2)}
          color={theme.colors.text}
          strokeWidth={2}
        />
      </View>
      <Text style={[styles.menuText, { color: theme.colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );

  const RadioButton = ({ selected }: { selected: boolean }) => (
    <View
      style={[
        styles.radioOuter,
        {
          borderColor: selected ? theme.colors.primary : theme.colors.textLight,
        },
      ]}
    >
      {selected && (
        <View
          style={[styles.radioInner, { backgroundColor: theme.colors.primary }]}
        />
      )}
    </View>
  );

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng xuất", style: "destructive", onPress: onLogout },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.headerContainer}>
        <Pressable
          style={styles.profileCard}
          onPress={() => router.push("/profile")}
        >
          <Avatar
            size={hp(6)}
            uri={
              typeof user?.image === "string"
                ? user.image
                : user?.image?.uri || ""
            }
            rounded={theme.radius.xl}
          />
          <View style={styles.userInfo}>
            <Text
              style={[styles.userName, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {user?.name || "Người dùng"}
            </Text>
            <Text
              style={[styles.viewProfile, { color: theme.colors.textLight }]}
            >
              Xem trang cá nhân
            </Text>
          </View>
        </Pressable>
      </View>

      <DrawerContentScrollView
        {...props}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <View style={styles.menuSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textLight }]}
          >
            Cá nhân
          </Text>
          <MenuItem icon="user" label="Bạn bè" />
          <MenuItem icon="heart" label="Yêu thích" />
          <MenuItem icon="image" label="Kỷ niệm" />
          <MenuItem icon="location" label="Gần đây" />
          <MenuItem icon="video" label="Video" />
        </View>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.gray }]}
        />

        <View style={styles.themeSection}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.textLight }]}
          >
            Giao diện
          </Text>
          <Pressable
            style={styles.themeOption}
            onPress={() => isDarkMode && toggleTheme()}
          >
            <Text style={[styles.themeText, { color: theme.colors.text }]}>
              Chế độ sáng
            </Text>
            <RadioButton selected={!isDarkMode} />
          </Pressable>
          <Pressable
            style={styles.themeOption}
            onPress={() => !isDarkMode && toggleTheme()}
          >
            <Text style={[styles.themeText, { color: theme.colors.text }]}>
              Chế độ tối
            </Text>
            <RadioButton selected={isDarkMode} />
          </Pressable>
        </View>
      </DrawerContentScrollView>

      <View
        style={[styles.drawerBottom, { borderTopColor: theme.colors.gray }]}
      >
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIconBox}>
            <Icon
              name="logout"
              size={hp(2.2)}
              color={theme.colors.rose}
              strokeWidth={2.5}
            />
          </View>
          <Text style={[styles.logoutText, { color: theme.colors.rose }]}>
            Đăng xuất
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: wp(4),
    marginTop: hp(7),
    marginBottom: hp(1),
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: wp(2),
  },
  userInfo: { flex: 1 },
  userName: { fontSize: hp(1.9), fontWeight: "700" },
  viewProfile: { fontSize: hp(1.5) },

  menuSection: {
    paddingHorizontal: wp(3),
    gap: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: 12,
  },
  iconBox: {
    width: hp(4),
    height: hp(4),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: { fontSize: hp(1.75), fontWeight: "500" },

  divider: {
    height: 1,
    marginHorizontal: wp(6),
    marginVertical: hp(2.5),
    opacity: 0.5,
  },

  themeSection: { paddingHorizontal: wp(3) },
  sectionTitle: {
    fontSize: hp(1.4),
    fontWeight: "700",
    marginBottom: hp(1.5),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.2),
  },
  radioOuter: {
    width: hp(2.2),
    height: hp(2.2),
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: { width: hp(1), height: hp(1), borderRadius: 5 },
  themeText: { flex: 1, fontSize: hp(1.8), fontWeight: "500" },

  drawerBottom: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(2.5),
    borderTopWidth: 0.5,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutIconBox: {
    width: hp(4),
    height: hp(4),
    borderRadius: 10,
    backgroundColor: "rgba(255, 0, 0, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: { fontSize: hp(1.85), fontWeight: "700" },
});

export default DrawerContent;
