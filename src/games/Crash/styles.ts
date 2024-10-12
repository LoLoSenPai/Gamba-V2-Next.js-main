// src/games/Crash/styles.ts
import styled, { keyframes } from "styled-components";

const generateMultipleBoxShadows = (
  n: number,
  color1: string,
  color2: string,
) => {
  if (typeof window === "undefined") return "";
  const maxX = window.innerWidth;
  const maxY = 4000;
  let value = `${Math.random() * maxX}px ${Math.random() * maxY}px ${color1}`;
  for (let i = 2; i <= n; i++) {
    const color = i % 2 === 0 ? color1 : color2;
    value += `, ${Math.random() * maxX}px ${Math.random() * maxY}px ${color}`;
  }
  return value;
};

const shadowsSmall = generateMultipleBoxShadows(700, "#88f7ff", "#ffffff");
const shadowsMedium = generateMultipleBoxShadows(200, "#00faff", "#ffffff");
const shadowsBig = generateMultipleBoxShadows(100, "#e0faff", "#ffffff");

export const animStar = keyframes`
  from {
    transform: translateY(-100vh);
  }
  to {
    transform: translateY(0);
  }
`;

export const StarsLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  animation: ${animStar} linear infinite;
`;

export const StarsLayer1 = styled(StarsLayer)`
  width: 1px;
  height: 1px;
  animation-duration: 150s;
  opacity: 1;
  transition: opacity 12s;
  box-shadow: ${shadowsSmall};
`;

export const LineLayer1 = styled(StarsLayer)`
  width: 1px;
  height: 15px;
  top: -15px;
  animation-duration: 75s;
  opacity: 0;
  transition: opacity 2s;
  box-shadow: ${shadowsSmall};
`;

export const StarsLayer2 = styled(StarsLayer)`
  width: 2px;
  height: 2px;
  animation-duration: 120s;
  box-shadow: ${shadowsMedium};
`;

export const LineLayer2 = styled(StarsLayer)`
  width: 2px;
  height: 25px;
  top: -25px;
  animation-duration: 50s;
  opacity: 0;
  transition: opacity 1.5s;
  box-shadow: ${shadowsMedium};
`;

export const StarsLayer3 = styled(StarsLayer)`
  width: 3px;
  height: 3px;
  animation-duration: 100s;
  box-shadow: ${shadowsBig};
`;

export const LineLayer3 = styled(StarsLayer)`
  width: 3px;
  height: 35px;
  top: -35px;
  animation-duration: 30s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${shadowsBig};
`;

export const StarsLayer4 = styled(StarsLayer)`
  width: 2px;
  height: 2px;
  animation-duration: 90s;
  box-shadow: ${shadowsMedium};
`;

export const LineLayer4 = styled(StarsLayer)`
  width: 2px;
  height: 40px;
  top: -40px;
  animation-duration: 25s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${shadowsMedium};
`;

export const StarsLayer5 = styled(StarsLayer)`
  width: 3px;
  height: 3px;
  animation-duration: 80s;
  box-shadow: ${shadowsBig};
`;

export const LineLayer5 = styled(StarsLayer)`
  width: 3px;
  height: 50px;
  top: -50px;
  animation-duration: 20s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${shadowsBig};
`;

export const StarsLayer6 = styled(StarsLayer)`
  width: 2px;
  height: 2px;
  animation-duration: 70s;
  box-shadow: ${shadowsMedium};
`;

export const LineLayer6 = styled(StarsLayer)`
  width: 2px;
  height: 60px;
  top: -60px;
  animation-duration: 15s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${shadowsMedium};
`;

export const StarsLayer7 = styled(StarsLayer)`
  width: 3px;
  height: 3px;
  animation-duration: 60s;
  box-shadow: ${shadowsBig};
`;

export const LineLayer7 = styled(StarsLayer)`
  width: 3px;
  height: 70px;
  top: -70px;
  animation-duration: 10s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${shadowsBig};
`;

export const StarsLayer8 = styled(StarsLayer)`
  width: 2px;
  height: 2px;
  animation-duration: 50s;
  box-shadow: ${shadowsMedium};
`;

export const LineLayer8 = styled(StarsLayer)`
  width: 2px;
  height: 80px;
  top: -80px;
  animation-duration: 8s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${shadowsMedium};
`;

export const StarsLayer9 = styled(StarsLayer)`
  width: 3px;
  height: 3px;
  animation-duration: 40s;
  box-shadow: ${shadowsBig};
`;

export const LineLayer9 = styled(StarsLayer)`
  width: 3px;
  height: 90px;
  top: -90px;
  animation-duration: 6s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${shadowsBig};
`;

export const StarsLayer10 = styled(StarsLayer)`
  width: 2px;
  height: 2px;
  animation-duration: 30s;
  box-shadow: ${shadowsMedium};
`;

export const LineLayer10 = styled(StarsLayer)`
  width: 2px;
  height: 100px;
  top: -100px;
  animation-duration: 5s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${shadowsMedium};
`;

export const ScreenWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
`;

export const MultiplierText = styled.div`
  font-size: 5rem;
  color: ${(props) => props.color || "#fff"};
  text-shadow: 0 0 20px #fff;
  z-index: 1;
  font-family: monospace;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Rocket = styled.div`
  position: absolute;
  width: 120px;
  aspect-ratio: 1 / 1;
  background-image: url("/games/crash/rocket.gif");
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 0.1s ease-out;
`;
