import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { hp, stripHtmlTags } from "@/helpers/common";
import { CreatePostLike, PostLike } from "@/models/postLikes";
import { Post } from "@/models/postModel";
import { User } from "@/models/userModel";
import { downloadFile, getSupabaseFileUrl } from "@/services/imageService";
import { createPostLike, removePostLike } from "@/services/postService";
import { Image } from "expo-image";
import { Router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
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
}
const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};
const tagsStyles = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard: React.FC<PostCardProps> = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
}) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  const [likes, setLikes] = useState<PostLike[]>([]);
  const liked = likes.filter((like) => like.userId == currentUser.id)[0]
    ? true
    : false;
  const created_at = moment(item.created_at).format("MMM D");
  const videoSource =
    typeof item?.file === "string" && item.file.includes("postVideos")
      ? { uri: item.file }
      : null;

  const player = videoSource
    ? useVideoPlayer(videoSource, (player) => {
        player.loop = true;
        player.muted = true;
        player.play();
      })
    : null;
  useEffect(() => {
    setLikes(item?.postLikes || []);
  }, [item]);
  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({ pathname: "/postDetails", params: { postId: item?.id } });
  };
  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes.filter((like) => like.userId != currentUser.id);
      setLikes([...updatedLikes]);
      let res = await removePostLike(item?.id || "", currentUser?.id);

      if (!res.success) {
        Alert.alert("Post", "Something went wrong !");
      }
    } else {
      const data: CreatePostLike = {
        userId: currentUser?.id || "",
        postId: item?.id || "",
      };

      setLikes((prev) => [...prev, data as any]);

      let res = await createPostLike(data);

      if (!res.success) {
        Alert.alert("Post", "Something went wrong !");
      }
    }
  };

  const onShare = async () => {
    const content: {
      message: string;
      url?: string;
    } = {
      message: stripHtmlTags(item?.body || "Check out this post!"),
    };

    if (item?.file && typeof item.file === "string") {
      console.log("Share file: ", item.file);
      const fileUrl = getSupabaseFileUrl(item.file);

      if (fileUrl?.uri) {
        const url = await downloadFile(fileUrl.uri);

        if (url) {
          content.url = url;
        }
      }
    }

    Share.share(content);
  };

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
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
            <Text style={styles.userName}>{created_at}</Text>
          </View>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
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
              enableExperimentalMarginCollapsing={true}
            />
          )}
        </View>
        {typeof item?.file === "string" && item.file.includes("postImages") && (
          <Image
            source={{ uri: item.file }}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}
        {typeof item?.file === "string" &&
          item.file.includes("postVideos") &&
          player && (
            <VideoView
              player={player}
              style={[styles.postMedia, { height: hp(30) }]}
              nativeControls
              contentFit="cover"
            />
          )}
      </View>
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
          <Text style={styles.count}>18</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onShare}>
            <Icon name="share" size={24} color={theme.colors.textDark} />
          </TouchableOpacity>
        </View>
      </View>
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
});
