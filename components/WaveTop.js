import React from "react";
import { Svg, Path } from "react-native-svg";

const WaveTop = () => {
  return (
    <Svg
      width="100%"
      height="100"
      viewBox="0 0 1440 320"
      style={{ position: "absolute", bottom: 0, left: 0 }}
    >
      <Path
        fill="#fff"
        d="M0,160L48,128C96,96,192,32,288,32C384,32,480,96,576,117.3C672,139,768,117,864,117.3C960,117,1056,139,1152,144C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      />
    </Svg>
  );
};

export default WaveTop;
