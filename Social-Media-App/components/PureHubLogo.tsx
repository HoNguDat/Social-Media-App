import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const PureHubLogo = ({ size = 28 }: { size?: number }) => {
  const { theme } = useTheme();
  const isDark = theme.colors.background === "#121212";

  const colors = {
    gradientEnd: isDark ? "#22C1C3" : "#4A7BFF",
    text: isDark ? "#FFFFFF" : "#0F172A",
  };

  return (
    <View style={styles.titleContainer}>
      <Text
        style={[
          styles.text,
          {
            fontSize: size,
            color: colors.text,
          },
        ]}
      >
        Pure
      </Text>

      <Text
        style={[
          styles.text,
          {
            fontSize: size,
            color: colors.gradientEnd,
            marginLeft: 2,
          },
        ]}
      >
        Hub
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "800",
    includeFontPadding: false,
  },
});
