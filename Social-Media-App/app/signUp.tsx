import Icon from "@/assets/icons";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
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

  const { mutate: signUpUser, isPending } = useMutation({
    mutationFn: async () => {
      if (!emailRef.current || !passwordRef.current || !nameRef.current) {
        throw new Error("Vui lòng điền đầy đủ thông tin!");
      }
      return await AuthService.signUp(
        emailRef.current,
        passwordRef.current,
        nameRef.current,
      );
    },
    onSuccess: () => {
      Alert.alert("Thành công", "Tài khoản của bạn đã được tạo.");
      router.replace("/drawer/home");
    },
    onError: (error: any) => {
      Alert.alert("Đăng ký thất bại", error.message);
    },
  });

  const onSubmit = useCallback(() => {
    Keyboard.dismiss();
    signUpUser();
  }, [signUpUser]);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
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
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value) => (emailRef.current = value)}
          />

          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            onChangeText={(value) => (passwordRef.current = value)}
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? "eye" : "eyeOff"}
                  size={26}
                  strokeWidth={1.6}
                />
              </Pressable>
            }
          />

          <Text style={styles.forgotPassword}>Forgot Password ?</Text>

          <Button title="Sign Up" onPress={onSubmit} loading={isPending} />
        </View>

        {/* Footer */}
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
    paddingBottom: 20,
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
    marginTop: 10,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
