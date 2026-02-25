import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import BackButton from "./BackButton";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  mb?: number;
}

const Header = ({
  title = "",
  showBackButton = false,
  mb = 10,
}: HeaderProps) => {
  const router = useRouter();

  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.semibold as any,
    color: theme.colors.textDark,
  },
  showBackButton: {
    position: "absolute",
    left: 0,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
});
