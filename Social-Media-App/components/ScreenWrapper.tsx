import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string;
}

const ScreenWrapper = ({ children, bg }: ScreenWrapperProps) => {
  const { top } = useSafeAreaInsets();

  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, paddingTop }}>{children}</View>
    </KeyboardAvoidingView>
  );
};

export default ScreenWrapper;
