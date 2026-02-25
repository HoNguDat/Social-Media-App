import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AuthService } from "../services/authService";
const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const [loanding, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await AuthService.signUp(
        emailRef.current!,
        passwordRef.current!,
        nameRef.current!,
      );
      Alert.alert("Signup success");

      router.replace("/home");
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScreenWrapper bg="white">
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <BackButton router={router} />
        <View>
          <Text style={styles.welcomeText}>Let,</Text>
          <Text style={styles.welcomeText}>Get Started !</Text>
        </View>
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please fill the details to create an account
          </Text>
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your name"
            onChangeText={(value) => (nameRef.current = value)}
          />
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            secureTextEntry={!showPassword} //
            onChangeText={(value) => (passwordRef.current = value)}
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Icon name={"eye"} size={26} strokeWidth={1.6} />
              </Pressable>
            }
          />
          <Text style={styles.forgotPassword}>Forgot Password ?</Text>
          <Button title="Sign Up" onPress={onSubmit} loading={loanding} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account ?</Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold as any,
                },
              ]}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold as any,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold as any,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
