import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { wp } from "@/helpers/common";
import { User } from "@/models/userModel";
import { Router, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <UserHeader user={user!} router={router} />
    </ScreenWrapper>
  );
};

export default Profile;

interface UserHeaderProps {
  user: User;
  router: Router;
}
const UserHeader: React.FC<UserHeaderProps> = ({ user, router }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title="Profile" showBackButton={true}></Header>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
