import Icon from "@/assets/icons";
import { useTheme } from "@/contexts/ThemeContext";
import { hp } from "@/helpers/common";
import { getFormattedDate } from "@/helpers/dateFormat";
import { Comment } from "@/models/comment";
import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Avatar from "./Avatar";

interface CommentItemProps {
  item: Comment;
  canDelete: boolean;
  onDelete: (comment: Comment) => void;
}

const CommentItem = ({
  item,
  canDelete = false,
  onDelete,
}: CommentItemProps) => {
  const { theme, isDarkMode } = useTheme();
  const createdAt = useMemo(() => {
    return getFormattedDate(item?.created_at);
  }, [item?.created_at]);

  const handleDelete = () => {
    Alert.alert("Xác nhận", "Xóa bình luận này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", onPress: () => onDelete(item), style: "destructive" },
    ]);
  };

  return (
    <View style={styles.container}>
      <Avatar uri={item?.user?.image ?? ""} size={hp(4.5)} />

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.userName, { color: theme.colors.textDark }]}>
            {item?.user?.name}
          </Text>
          <Text style={[styles.dot, { color: theme.colors.textLight }]}>•</Text>
          <Text style={[styles.timeText, { color: theme.colors.textLight }]}>
            {createdAt}
          </Text>
        </View>
        <View style={styles.commentBody}>
          <Text style={[styles.commentText, { color: theme.colors.textDark }]}>
            {item.text}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.actionsRow}>
            <TouchableOpacity>
              <Text
                style={[styles.actionText, { color: theme.colors.textLight }]}
              >
                Trả lời
              </Text>
            </TouchableOpacity>
            <View
              style={[
                styles.likeInfo,
                {
                  backgroundColor: isDarkMode
                    ? theme.colors.darkLight
                    : "white",
                  shadowColor: isDarkMode ? "transparent" : "#000",
                },
              ]}
            >
              <Icon name="heart" size={14} color={theme.colors.primary} />
              <Text
                style={[styles.likeCount, { color: theme.colors.textLight }]}
              >
                47
              </Text>
            </View>

            {canDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                style={{ marginLeft: 15 }}
              >
                <Text style={[styles.actionText, { color: theme.colors.rose }]}>
                  Xóa
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.rightLikeBtn}>
            <Icon name="heart" size={18} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginVertical: 8,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  userName: {
    fontSize: hp(1.6),
    fontWeight: "700",
  },
  dot: {
    marginHorizontal: 4,
    fontSize: hp(1.2),
  },
  timeText: {
    fontSize: hp(1.5),
  },
  commentBody: {
    marginTop: 2,
  },
  commentText: {
    fontSize: hp(1.7),
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  actionText: {
    fontSize: hp(1.5),
    fontWeight: "600",
  },
  likeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
    paddingHorizontal: 4,
  },
  likeCount: {
    fontSize: hp(1.4),
    marginLeft: 3,
  },
  rightLikeBtn: {
    alignSelf: "center",
    paddingLeft: 10,
  },
});
