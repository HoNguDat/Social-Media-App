import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { getUserData } from "../services/userService";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};
const MainLayout = () => {
  const { setAuth } = useAuth();
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Session user: ", session?.user);
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.replace("/login");
      }
    });
  }, []);
  const updateUserData = async (user: User) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setAuth(res.data);
    } else {
      console.log("Failed to fetch user data: ", res.msg);
    }
    console.log("User data from DB: ", res);
  };
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;
