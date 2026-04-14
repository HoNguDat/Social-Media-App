import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const CircleMinus = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill="none"
    stroke="#141B34"
    color="#000000"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M16 12H8" />
    <Circle cx="12" cy="12" r="10" />
  </Svg>
);

export default CircleMinus;
