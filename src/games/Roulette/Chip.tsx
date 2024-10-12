import styled, { css } from "styled-components";

import React from "react";

const StyledChip = styled.div<{ $color: string }>`
  width: 18px;
  height: 18px;
  line-height: 16px;
  border-radius: 10px;
  background: var(--chip-color);
  border: 1px dashed var(--border-color);
  color: black;
  font-size: 9px;
  font-weight: bold;
  color: var(--text-color);
  box-shadow: 0 0 0 1px var(--chip-color);
  padding: 0;
  display: inline-block;
  text-align: center;
  user-select: none;

  ${(props) =>
    props.$color === "white" &&
    css`
      --chip-color: #f0f0ff;
      --border-color: #000000;
      --text-color: #000000;
    `}
  ${(props) =>
    props.$color === "green" &&
    css`
      --chip-color: #47ff7d;
      --border-color: #000000;
      --text-color: #000000;
    `}
  ${(props) =>
    props.$color === "red" &&
    css`
      --chip-color: #ff5b72;
      --border-color: #000000;
      --text-color: #000000;
    `}
  ${(props) =>
    props.$color === "blue" &&
    css`
      --chip-color: #00ffff;
      --border-color: #000000;
      --text-color: #000000;
    `}
    ${(props) =>
    props.$color === "yellow" &&
    css`
      --chip-color: #fffb00;
      --border-color: #000000;
      --text-color: #000000;
    `}
      ${(props) =>
    props.$color === "orange" &&
    css`
      --chip-color: #ffa500;
      --border-color: #000000;
      --text-color: #000000;
    `}
`;

const color = (value: number) => {
  if (value <= 1) return "green";
  if (value <= 2) return "red";
  if (value <= 3) return "blue";
  if (value <= 4) return "yellow";
  if (value <= 5) return "orange";
  if (value <= 10) return "white";
  return "white";
};

export function Chip({ value }: { value: number }) {
  return <StyledChip $color={color(value)}>{value}</StyledChip>;
}
