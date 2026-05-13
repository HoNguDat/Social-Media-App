import Icon from "@/assets/icons";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { toast } from "@/constants/toast";
import { useAuth } from "@/contexts/AuthContext";
import { hp, wp } from "@/helpers/common";
import { User } from "@/models/userModel";
import { getUserImageSrc, uploadFile } from "@/services/fileService";
import { updateUser } from "@/services/userService";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type EditUserState = Partial<User> & {
  image: string | ImagePicker.ImagePickerAsset | null;
};
const EditProfile = () => {
  const router = useRouter();
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<EditUserState>({
    name: "",
    phoneNumber: "",
    image: null,
    bio: "",
    address: "",
  });
  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || null,
        address: currentUser.address || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };
  const imageSource =
    typeof user.image === "object" && user.image !== null && "uri" in user.image
      ? { uri: (user.image as ImagePickerAsset).uri }
      : getUserImageSrc(user.image);

  const onSubmit = async () => {
    let userData = { ...user };
    const imagetest = userData.image;
    let { name, phoneNumber, address, image, bio } = userData;
    if (!name || !phoneNumber || !address || !bio || !image) {
      Alert.alert("Profile", "Please fill all the fields");

      return;
    }
    setLoading(true);
    if (image && typeof image === "object" && "uri" in image) {
      const imageRes = await uploadFile("profiles", image, true);
      if (imageRes.success && imageRes.publicUrl) {
        userData.image = imageRes.publicUrl!;
      } else {
        Alert.alert("Upload failed", imageRes.msg);
        setLoading(false);
        return;
      }
    }
    if (!currentUser) return;
    const res = await updateUser(currentUser.id, userData);
    setLoading(false);
    if (res.success) {
      setUserData({
        ...currentUser,
        ...userData,
      });
      toast.success("Cập nhật trang cá nhân thành công !");
      router.back();
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.surface}>
      <View style={styles.container}>
        <Header title="Edit Profile" showBackButton={true} />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image
                source={getUserImageSrc(user.image)}
                style={styles.avatar}
              />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name={"camera"} size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input
              icon={<Icon name={"user"} />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name={"call"} />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name={"location"} />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};
EditProfile.whydidYouRender = true;
export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(1.5),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderRadius: theme.radius.xxl,
    borderColor: theme.colors.text,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
