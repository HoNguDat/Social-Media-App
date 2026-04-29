// Thêm các import cần thiết
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { hp } from "@/helpers/common";
import { StyleSheet, TouchableOpacity } from "react-native";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

export const renderRightActions = (progess: any, dragX: any, itemId: any) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: 0 }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <TouchableOpacity
        style={styles.deleteButton}
        //onPress={() => handleDeleteNotification(itemId)}
      >
        <Icon name="delete" size={20} color="white" />
      </TouchableOpacity>
    </Reanimated.View>
  );
};
const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: theme.colors.rose,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "85%",
    alignSelf: "center",
    borderRadius: 18,
    marginLeft: 10,
  },

  swipeableContainer: {
    marginBottom: hp(1.5),
  },
});
