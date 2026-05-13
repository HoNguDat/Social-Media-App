import { hp, wp } from "@/helpers/common";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  fbToast: ({ text1, props }: any) => (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={2}>
        {text1}
      </Text>

      {props.onUndo && (
        <TouchableOpacity
          onPress={() => {
            props.onUndo();
            Toast.hide();
          }}
          style={styles.undoButton}
          activeOpacity={0.7}
        >
          <Text style={styles.undoText}>HOÀN TÁC</Text>
        </TouchableOpacity>
      )}
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    minHeight: hp(5.5),
    width: wp(92),
    backgroundColor: "#323232",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: hp(1.6),
    fontWeight: "400",
    flex: 1,
    marginRight: wp(2),
  },
  undoButton: {
    paddingVertical: hp(0.5),
    paddingLeft: wp(3),
  },
  undoText: {
    color: "#45bd62",
    fontWeight: "bold",
    fontSize: hp(1.6),
    letterSpacing: 0.5,
  },
});
