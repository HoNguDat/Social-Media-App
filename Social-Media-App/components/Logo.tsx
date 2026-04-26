import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Svg, {
    Defs,
    Stop,
    LinearGradient as SvgGradient,
    Text as SvgText,
} from "react-native-svg";

export const GradientHub = ({ size = 32 }: { size?: number }) => {
  const svgHeight = size * 1.5;
  const svgWidth = size * 2.2;

  return (
    <Svg height={svgHeight} width={svgWidth}>
      <Defs>
        <SvgGradient id="gradHub" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#4A7BFF" />
          <Stop offset="1" stopColor="#22C1C3" />
        </SvgGradient>
      </Defs>
      <SvgText
        fill="url(#gradHub)"
        fontSize={size}
        fontWeight="700"
        x="0"
        y={size * 1.12}
        dy={Platform.OS === "ios" ? -1 : 1}
        alignmentBaseline="baseline"
      >
        Hub
      </SvgText>
    </Svg>
  );
};

export const PureHubLogo = ({
  size = 32,
  color = "#0F172A",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={[styles.pureText, { fontSize: size, color: color }]}>
        Pure
      </Text>
      <View style={{ marginLeft: -2 }}>
        <GradientHub size={size} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pureText: {
    fontWeight: "800",
    includeFontPadding: false,
    color: "#000000",
  },
});
