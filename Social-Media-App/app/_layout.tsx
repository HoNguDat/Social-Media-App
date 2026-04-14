import Icon from "@/assets/icons";
import DrawerContent from "@/components/DrawerContent";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { hp } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getUserData } from "../services/userService";
const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
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

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
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
    }
  };

  return (
    <>
      <StatusBar
        key={isDarkMode ? "light" : "dark"}
        style={isDarkMode ? "light" : "dark"}
      />
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: theme.colors.textLight,
          drawerStyle: {
            backgroundColor: theme.colors.background,
            width: "80%",
          },
          drawerType: "front",
          overlayColor: "rgba(0,0,0,0.5)",
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Bảng feed",
            drawerLabelStyle: { color: theme.colors.text },
            drawerIcon: ({ color }) => (
              <Icon name="home" size={hp(2.5)} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="postDetails"
          options={{
            drawerItemStyle: { display: "none" },
            swipeEnabled: false,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="newPost"
          options={{
            drawerItemStyle: { display: "none" },
            swipeEnabled: false,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="notification"
          options={{
            drawerLabel: "Thông báo",
            drawerLabelStyle: { color: theme.colors.text },
            drawerIcon: ({ color }) => (
              <Icon name="heart" size={hp(2.5)} color={color} />
            ),
          }}
        />
      </Drawer>
    </>
  );
};

export default _layout;
