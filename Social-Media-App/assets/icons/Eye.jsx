import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Eye = (props) => (
  <Svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </Svg>
);

export default Eye;
