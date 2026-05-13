import { theme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string;
  loading?: boolean;
  darkStatusBar?: boolean;
  withStepBack?: boolean;
  canDismissKeyboard?: boolean;
}

const ScreenWrapper = ({
  children,
  bg = "white",
  loading = false,
  darkStatusBar = true,
  withStepBack = false,
  canDismissKeyboard = true,
}: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  const paddingTop =
    insets.top > 0 ? insets.top + 5 : Platform.OS === "ios" ? 30 : 10;
  const paddingBottom = withStepBack ? insets.bottom : 0;
  const Content = (
    <View
      style={[
        styles.container,
        { paddingTop, paddingBottom, backgroundColor: bg },
      ]}
    >
      {children}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar style={darkStatusBar ? "dark" : "light"} />
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* KIỂM TRA ĐIỀU KIỆN TẠI ĐÂY */}
        {canDismissKeyboard ? (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            {Content}
          </TouchableWithoutFeedback>
        ) : (
          Content
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loadingBox: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default ScreenWrapper;
