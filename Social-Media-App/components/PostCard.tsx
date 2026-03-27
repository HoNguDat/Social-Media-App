import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { hp, stripHtmlTags } from "@/helpers/common";
import { PostLike } from "@/models/postLikes";
import { Post } from "@/models/postModel";
import { User } from "@/models/userModel";
import { downloadFile, getSupabaseFileUrl } from "@/services/imageService";
import {
  createPostLike,
  removePost,
  removePostLike,
} from "@/services/postService";
import { Image } from "expo-image";
import { Router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import Avatar from "./Avatar";
interface PostCardProps {
  item: Post;
  currentUser: User;
  router: Router;
  hasShadow?: boolean;
  showMoreIcon?: boolean;
  onDelete?: (postId: number) => void;
}
const VideoElement = ({ source }: { source: { uri: string } }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <VideoView
      player={player}
      style={[styles.postMedia, { height: hp(30) }]}
      nativeControls
      contentFit="cover"
    />
  );
};

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: { color: theme.colors.dark },
  h4: { color: theme.colors.dark },
};

const PostCard: React.FC<PostCardProps> = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  onDelete,
}) => {
  const shadowStyles = {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  const [showOptions, setShowOptions] = useState(false);
  const [likes, setLikes] = useState<PostLike[]>([]);
  const [loadingLike, setLoadingLike] = useState(false);
  useEffect(() => {
    setLikes(item?.postLikes || []);
  }, [item?.postLikes]);

  const liked = likes.some((like) => like.userId == currentUser.id);
  const created_at = moment(item.created_at).format("MMM D");
  const videoSource =
    item?.file &&
    typeof item.file === "string" &&
    item.file.includes("postVideos")
      ? { uri: item.file }
      : null;

  // --- CẢI TIẾN: MEMOIZED FUNCTIONS ---
  const openPostDetails = useCallback(() => {
    if (!showMoreIcon) return;
    router.push({ pathname: "/postDetails", params: { postId: item?.id } });
  }, [showMoreIcon, item?.id]);

  const onLike = async () => {
    if (loadingLike) return; // Nếu đang xử lý thì không cho bấm tiếp

    setLoadingLike(true);
    const oldLikes = [...likes]; // Lưu lại phòng trường hợp lỗi

    if (liked) {
      // Giả định xóa like thành công để UI đổi màu ngay
      setLikes((prev) =>
        prev.filter((l) => String(l.userId) !== String(currentUser.id)),
      );

      let res = await removePostLike(item.id as number, currentUser?.id);
      if (!res.success) {
        setLikes(oldLikes); // Rollback nếu lỗi
        Alert.alert("Lỗi", "Không thể bỏ thích bài viết");
      }
    } else {
      // Giả định thêm like thành công
      const newLike = { userId: currentUser.id, postId: item.id };
      setLikes((prev) => [...prev, newLike as any]);

      let res = await createPostLike({
        userId: currentUser.id,
        postId: item.id as any,
      });
      if (!res.success) {
        setLikes(oldLikes); // Rollback nếu lỗi
        Alert.alert("Lỗi", "Không thể thích bài viết");
      }
    }
    setLoadingLike(false);
  };
  const onShare = async () => {
    const content: { message: string; url?: string } = {
      message: stripHtmlTags(item?.body || "Check out this post!"),
    };
    if (item?.file && typeof item.file === "string") {
      const fileUrl = getSupabaseFileUrl(item.file);
      if (fileUrl?.uri) {
        const url = await downloadFile(fileUrl.uri);
        if (url) content.url = url;
      }
    }
    Share.share(content);
  };
  const handleDeletePost = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa bài viết này không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const res = await removePost(item.id as number);
          if (res.success) {
            Alert.alert("Thành công", "Bài viết đã được xóa.");
            if (onDelete) {
              onDelete(item.id as number);
            }
            if (!onDelete && showMoreIcon) {
              router.back();
            }
          } else {
            Alert.alert("Lỗi", res.msg || "Không thể xóa bài viết.");
          }
        },
      },
    ]);
  };
  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      {/* BỌC TOÀN BỘ PHẦN NỘI DUNG VÀO PRESSABLE 
          để khi ấn vào vùng trắng sẽ vào Details 
      */}
      <Pressable onPress={openPostDetails} style={styles.mainClickableArea}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar
              size={hp(4.5)}
              uri={
                typeof item?.user?.image === "string"
                  ? item?.user?.image
                  : item?.user?.image?.uri || ""
              }
              rounded={theme.radius.md}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.userName}>{item.user?.name}</Text>
              <Text style={styles.postTime}>{created_at}</Text>
            </View>
          </View>

          {/* NÚT BA CHẤM - NGĂN CHẶN BUBBLING SỰ KIỆN */}
          {showMoreIcon && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // Ngăn không cho sự kiện nhấn lan ra vùng trắng
                setShowOptions(true);
              }}
              style={styles.moreIcon}
            >
              <Icon
                name="threeDotsHorizontal"
                size={hp(3.4)}
                strokeWidth={3}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.postBody}>
            {item?.body && (
              <RenderHtml
                contentWidth={Dimensions.get("window").width}
                source={{ html: item?.body }}
                tagsStyles={tagsStyles}
              />
            )}
          </View>
          {typeof item?.file === "string" &&
            item.file.includes("postImages") && (
              <Image
                source={{ uri: item.file }}
                transition={100}
                style={styles.postMedia}
                contentFit="cover"
              />
            )}
          {/* VideoElement giữ nguyên */}
        </View>
      </Pressable>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={24}
              color={liked ? theme.colors.rose : theme.colors.textDark}
              fill={liked ? theme.colors.rose : "transparent"}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.count}>
            {(item?.comments?.[0] as any)?.count ?? item?.comments?.length ?? 0}
          </Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onShare}>
            <Icon name="share" size={24} color={theme.colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            {currentUser.id === item.userId ? (
              <>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setShowOptions(false);
                    // logic edit bài viết
                  }}
                >
                  <Icon name="edit" size={20} color={theme.colors.text} />
                  <Text style={styles.modalOptionText}>Chỉnh sửa bài viết</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalOption]}
                  onPress={() => {
                    setShowOptions(false);
                    handleDeletePost();
                  }}
                >
                  <Icon name="delete" size={20} color={theme.colors.rose} />
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: theme.colors.rose },
                    ]}
                  >
                    Xóa bài viết
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => setShowOptions(false)}
                >
                  <Icon name="circlePlus" size={20} color={theme.colors.text} />
                  <Text style={styles.modalOptionText}>Quan tâm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => setShowOptions(false)}
                >
                  <Icon
                    name="circleMinus"
                    size={20}
                    color={theme.colors.text}
                  />
                  <Text style={styles.modalOptionText}>Không quan tâm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => setShowOptions(false)}
                >
                  <Icon name="cancel" size={20} color={theme.colors.text} />
                  <Text style={styles.modalOptionText}>Ẩn bài viết</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => setShowOptions(false)}
                >
                  <Icon name="share" size={20} color={theme.colors.text} />
                  <Text style={styles.modalOptionText}>Sao chép liên kết</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default PostCard;
const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium as any,
  },
  postTime: {
    fontSize: hp(1.7),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium as any,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
  mainClickableArea: {
    // Đảm bảo vùng nhấn bao phủ toàn bộ nội dung trừ footer
  },
  moreIcon: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: "55%", // Bạn có thể chỉnh lên 70% nếu muốn nhiều option hơn
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.gray,
  },
  modalOptionText: {
    fontSize: hp(1.8),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
});
