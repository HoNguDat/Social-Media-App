import React from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";

interface InputProps extends TextInputProps {
  containerStyles?: ViewStyle;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  inputRef?: React.RefObject<TextInput>;
}

const Input = (props: InputProps) => {
  return (
    <View
      style={[styles.container, props.containerStyles && props.containerStyles]}
    >
      {props.icon && props.icon}

      <TextInput
        style={styles.textInput}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      />

      {props.rightIcon && props.rightIcon}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7.2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
  textInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: hp(1.9),
  },
});
