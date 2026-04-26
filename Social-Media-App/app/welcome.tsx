import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Defs,
  Stop,
  LinearGradient as SvgGradient,
  Text as SvgText,
} from "react-native-svg";
import { hp, wp } from "../helpers/common";

const GradientHub = () => (
  <Svg height="40" width="80">
    <Defs>
      <SvgGradient id="gradHub" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#4A7BFF" />
        <Stop offset="1" stopColor="#22C1C3" />
      </SvgGradient>
    </Defs>
    <SvgText fill="url(#gradHub)" fontSize="32" fontWeight="700" x="0" y="31">
      Hub
    </SvgText>
  </Svg>
);

export default function Welcome() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.topSection}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.pureText}>Pure</Text>
          <GradientHub />
        </View>
        <Text style={styles.subtitle}>Kết nối tử tế – Cộng đồng văn minh</Text>
      </View>

      <View style={styles.midSection}>
        <Image
          source={require("../assets/images/people.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.featuresCard}>
          <View style={styles.featureItem}>
            <View style={[styles.iconCircle, { backgroundColor: "#E0E7FF" }]}>
              <Text style={styles.icon}>🛡️</Text>
            </View>
            <Text style={styles.featureText}>An toàn{"\n"}& Minh bạch</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.iconCircle, { backgroundColor: "#CCFBF1" }]}>
              <Text style={styles.icon}>👥</Text>
            </View>
            <Text style={styles.featureText}>Cộng đồng{"\n"}văn minh</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.iconCircle, { backgroundColor: "#F3E8FF" }]}>
              <Text style={styles.icon}>💜</Text>
            </View>
            <Text style={styles.featureText}>Tích cực{"\n"}& Tử tế</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={() => router.push("/signUp")}
            activeOpacity={0.8}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={["#4A7BFF", "#22C1C3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Getting Started →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.noAccountText}>Already have account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingVertical: hp(4),
  },
  topSection: {
    alignItems: "center",
    marginTop: hp(2),
  },
  logo: {
    width: wp(70),
    height: wp(70),
    position: "absolute",
    top: hp(-5),
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(18),
  },
  pureText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0F172A",
    includeFontPadding: false,
  },
  subtitle: {
    color: "#64748B",
    marginTop: hp(1),
    fontSize: hp(1.9),
    fontWeight: "500",
  },
  midSection: {
    flex: 1,
    height: hp(28),
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: wp(85),
    height: hp(24),
    zIndex: 2,
  },
  bottomSection: {
    width: "100%",
  },
  featuresCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 15,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: hp(3),
  },

  featureItem: {
    alignItems: "center",
    width: "30%",
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
  },
  featureText: {
    textAlign: "center",
    fontSize: hp(1.5),
    fontWeight: "600",
    color: "#334155",
    lineHeight: 18,
  },
  actionContainer: {
    marginTop: hp(3),
  },
  buttonWrapper: {
    shadowColor: "#4A7BFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  button: {
    width: "100%",
    paddingVertical: hp(2.2),
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: hp(2.1),
  },
  loginRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  noAccountText: {
    color: "#64748B",
    fontSize: hp(1.8),
  },
  loginText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: hp(1.8),
    textDecorationLine: "underline",
  },
});
