import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { User } from "@/models/userModel";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface HomeHeaderProps {
  user: User | null;
}

const HomeHeader = ({ user }: HomeHeaderProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.leftHeader}>
        {/* Nút ba gạch Hamburger */}
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())} // Lệnh mở Drawer
          style={styles.hamburgerBtn}
        >
          <Icon
            name={"listView"} // Bạn có thể đổi sang icon ba gạch chuẩn nếu có trong assets
            size={hp(3)}
            strokeWidth={2}
            color={theme.colors.text}
          />
        </Pressable>

        <Text style={styles.title}>LinkUp</Text>
      </View>
      <View style={styles.icon}>
        <Pressable onPress={() => router.push("/notification")}>
          <Icon
            name={"heart"}
            size={hp(3.2)}
            strokeWidth={2}
            color={theme.colors.text}
          />
        </Pressable>
        <Pressable onPress={() => router.push("/newPost")}>
          <Icon
            name={"plus"}
            size={hp(3.2)}
            strokeWidth={2}
            color={theme.colors.text}
          />
        </Pressable>
        <Pressable onPress={() => router.push("/profile")}>
          <Avatar
            size={hp(4.3)}
            uri={
              typeof user?.image === "string"
                ? user.image
                : user?.image?.uri || ""
            }
            rounded={theme.radius.sm}
            style={{ borderWidth: 2 }}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hamburgerBtn: {
    padding: 5,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold as any,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
});
