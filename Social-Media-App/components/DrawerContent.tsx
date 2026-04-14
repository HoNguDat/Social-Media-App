import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { hp, wp } from "@/helpers/common";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DrawerContent = (props: any) => {
  const { user } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();

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
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.headerContainer}>
        <View
          style={[
            styles.drawerHeader,
            {
              borderColor: theme.colors.gray,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.md,
            },
          ]}
        >
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
            <Text style={[styles.userName, { color: theme.colors.textDark }]}>
              {user?.name || "User Name"}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.textLight }]}>
              {user?.email || "email@example.com"}
            </Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        {/* PHẦN CHỌN CHẾ ĐỘ SÁNG TỐI */}
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
        <Pressable style={styles.settingButton}>
          <Icon
            name="threeDotsHorizontal"
            size={hp(2.5)}
            color={theme.colors.textLight}
          />
          <Text style={[styles.settingText, { color: theme.colors.text }]}>
            Cài đặt & quyền riêng tư
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: wp(5),
    marginTop: hp(6),
    paddingTop: hp(2),
  },
  drawerHeader: {
    padding: wp(4),
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: hp(2.2), fontWeight: "700" },
  userEmail: { fontSize: hp(1.6) },

  themeSection: {
    paddingHorizontal: wp(4),
    marginTop: hp(2),
  },
  sectionTitle: {
    fontSize: hp(1.6),
    fontWeight: "600",
    marginBottom: hp(1),
    marginLeft: wp(2),
    textTransform: "uppercase",
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
  },
  radioOuter: {
    width: hp(2.4),
    height: hp(2.4),
    borderRadius: hp(1.2),
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: hp(1.2),
    height: hp(1.2),
    borderRadius: hp(0.6),
  },
  iconCircle: {
    width: hp(4),
    height: hp(4),
    borderRadius: hp(2),
    justifyContent: "center",
    alignItems: "center",
  },
  themeText: {
    flex: 1,
    fontSize: hp(1.8),
    fontWeight: "500",
  },

  drawerBottom: {
    padding: wp(5),
    borderTopWidth: 0.5,
    marginBottom: hp(2),
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  settingText: { fontSize: hp(1.8) },
});

export default DrawerContent;
