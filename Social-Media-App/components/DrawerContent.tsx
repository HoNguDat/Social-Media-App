import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DrawerContent = (props: any) => {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      {/* 1. Phần Header bên trong Drawer (Avatar & Tên) */}
      <View style={styles.drawerHeader}>
        <Avatar
          size={hp(7)}
          uri={
            typeof user?.image === "string"
              ? user.image
              : user?.image?.uri || ""
          }
          rounded={theme.radius.md}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || "User Name"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "email@example.com"}
          </Text>
        </View>
      </View>

      {/* 2. Danh sách các trang mặc định (Home, Profile...) */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* 3. Phần Bottom bên trong Drawer (Nút Setting) */}
      <View style={styles.drawerBottom}>
        <Pressable
          style={styles.settingButton}
          onPress={() => {
            props.navigation.closeDrawer(); // Đóng menu trước
            //router.push("/settings"); // Chuyển sang trang setting
          }}
        >
          <Icon
            name="threeDotsHorizontal"
            size={hp(2.5)}
            color={theme.colors.textLight}
          />
          <Text style={styles.settingText}>Cài đặt & quyền riêng tư</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerHeader: {
    padding: wp(5),
    paddingTop: hp(6), // Đẩy xuống dưới thanh trạng thái
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.gray,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.bold as any,
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
  },
  drawerBottom: {
    padding: wp(5),
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.gray,
    marginBottom: hp(2), // Cách viền dưới một chút
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  settingText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium as any,
  },
});
