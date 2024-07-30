import React from "react";
import { Svg, Path } from "react-native-svg";

const WaveTop = () => {
  return (
    <Svg
      width="100%"
      height="100"
      viewBox="0 0 1440 320"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Path fill="#fff" d="M0,192L1440,64L1440,320L0,320Z" />
    </Svg>
  );
};

export default WaveTop;
