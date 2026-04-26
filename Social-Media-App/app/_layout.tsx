import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getUserData } from "../services/userService";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();
const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const AppContent = () => {
  return (
    <>
      <MainLayout />
    </>
  );
};
const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const [isAppReady, setIsAppReady] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const prepareApp = async () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, sess) => {
        setSession(sess);
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAppReady(true);
      return () => subscription.unsubscribe();
    };

    prepareApp();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();

      if (session) {
        setAuth(session.user);
        updateUserData(session.user, session.user.email);
        router.replace("/drawer/home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    }
  }, [isAppReady, session]);

  if (!isAppReady) return null;

  const updateUserData = async (user: User, email: string | undefined) => {
    if (!user) return;
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

      <Stack.Screen name="postDetails" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="editProfile" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="newPost" />
      <Stack.Screen name="friendRequest" />

      <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="signUp" />
    </Stack>
  );
};

export default _layout;
