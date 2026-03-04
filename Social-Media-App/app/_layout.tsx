import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getUserData } from "../services/userService";

const _layout = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
};
const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Session user: ", session?.user);
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user.email);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);
  const updateUserData = async (user: User, email: string | undefined) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    } else {
      console.log("Failed to fetch user data: ", res.msg);
    }
    console.log("User data from DB: ", res);
  };
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;
