import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Header from "@/components/Header";
import RichTextEditor from "@/components/RichTextEditor";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import { Post } from "@/models/postModel";
import { getSupabaseFileUrl } from "@/services/imageService";
import { createOrUpdatePost } from "@/services/postService";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
const NewPost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef<RichEditor | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [file, setFile] = useState<
  //   string | ImagePicker.ImagePickerAsset | null
  // >(null);
  const [file, setFile] = useState<
    string | ImagePicker.ImagePickerAsset | null
  >(null);
  // const onPick = async (isImage: boolean) => {
  //   let mediaConfig: ImagePicker.ImagePickerOptions = {
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 0.7,
  //   };

  //   if (!isImage) {
  //     mediaConfig = {
  //       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
  //       allowsEditing: true,
  //     };
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
  //   if (!result.canceled) {
  //     setFile(result.assets[0]);
  //   }
  // };
  const onPick = async (isImage: boolean) => {
    let mediaConfig: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };

    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }

    const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };
  // type FileType = string | ImagePickerAsset | null;
  // const isLocalFile = (file: FileType): boolean => {
  //   if (!file) return false;
  //   return typeof file === "object";
  // };
  // const getFileType = (file: FileType): "image" | "video" | null => {
  //   if (!file) return null;

  //   if (isLocalFile(file)) {
  //     return (file as ImagePickerAsset).type === "video" ? "video" : "image";
  //   }
  //   if (typeof file === "string" && file.includes("postImage")) {
  //     return "image";
  //   }

  //   return "video";
  // };
  // const getFileUri = (file: FileType): { uri: string } | undefined => {
  //   if (!file) return undefined;

  //   if (isLocalFile(file)) {
  //     return { uri: (file as ImagePickerAsset).uri };
  //   }

  //   return getSupabaseFileUrl(file as string);
  // };
  type FileType = string | ImagePicker.ImagePickerAsset | null;

  const isLocalFile = (
    file: FileType,
  ): file is ImagePicker.ImagePickerAsset => {
    return typeof file === "object" && file !== null;
  };

  const getFileType = (file: FileType): "image" | "video" | null => {
    if (!file) return null;

    if (isLocalFile(file)) {
      return file.type === "video" ? "video" : "image";
    }

    if (typeof file === "string") {
      if (file.endsWith(".mp4") || file.endsWith(".mov")) return "video";
      return "image";
    }

    return null;
  };

  const getFileUri = (file: FileType): { uri: string } | null => {
    if (!file) return null;

    if (isLocalFile(file)) {
      return { uri: file.uri };
    }

    if (typeof file === "string") {
      return getSupabaseFileUrl(file) ?? null;
    }

    return null;
  };
  const getVideoUri = (file: FileType): string | null => {
    if (!file) return null;

    if (isLocalFile(file)) {
      return file.uri;
    }

    if (typeof file === "string") {
      return getSupabaseFileUrl(file)?.uri ?? null;
    }

    return null;
  };
  const uriObj = getFileUri(file);
  const videoUri = getVideoUri(file);

  console.log("FILE:", file);
  console.log("IMAGE URI:", uriObj);
  console.log("VIDEO URI:", videoUri);
  const player = useVideoPlayer(videoUri ?? "", (player) => {
    player.loop = true;
  });

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert("Post", "please add text or media");
      return;
    }

    const postData: Post = {
      body: bodyRef.current,
      file: file,
      userId: user?.id,
    };

    setLoading(true);

    const res = await createOrUpdatePost(postData);

    setLoading(false);

    console.log("Create post result:", res);

    if (res.success) {
      (setFile(null),
        (bodyRef.current = ""),
        editorRef.current?.setContentHTML(""),
        router.back());
    } else {
      Alert.alert("Create post fail");
    }
  };
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />
        <ScrollView
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ gap: 10 }}
        >
          <View style={styles.header}>
            <Avatar
              uri={
                typeof user?.image === "string"
                  ? user.image
                  : user?.image?.uri || ""
              }
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{user && user.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>
          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
            />
          </View>
          {/* {file && (
            <View style={styles.file}>
              {getFileType(file) == "video" ? (
                <Video
                  style={{ flex: 1 }}
                  source={getFileUri(file)}
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                />
              ) : (
                <Image
                  source={getFileUri(file)}
                  resizeMode="cover"
                  style={{ flex: 1 }}
                />
              )}
              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name={"delete"} size={25} color={"white"} />
              </Pressable>
            </View>
          )} */}
          {file && (
            <View style={styles.file}>
              {getFileType(file) === "video"
                ? videoUri && (
                    <VideoView
                      player={player}
                      style={{ flex: 1 }}
                      nativeControls
                      contentFit="cover"
                    />
                  )
                : uriObj && (
                    <Image
                      source={uriObj}
                      resizeMode="cover"
                      style={{ flex: 1 }}
                    />
                  )}

              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name={"delete"} size={25} color={"white"} />
              </Pressable>
            </View>
          )}
          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          title="Post"
          buttonStyle={{ height: hp(6.2) }}
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold as any,
    color: theme.colors.text,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold as any,
    color: theme.colors.text,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium as any,
    color: theme.colors.textLight,
  },
  textEditor: {},
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold as any,
    color: theme.colors.text,
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  video: {},
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "rgba(255,0,0,0.6)",
  },
});
