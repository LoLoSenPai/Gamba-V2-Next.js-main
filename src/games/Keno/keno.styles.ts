// src/games/Keno/keno.styles.ts
/*
 * Author: BankkRoll
 */
import styled, { css, keyframes } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Grid = styled.div`
  --num-cols: 8;
  display: grid;
  grid-template-columns: repeat(var(--num-cols), 1fr);
  gap: 5px;
  margin: auto;
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0px rgba(0, 255, 0, 0.7);
  }
  100% {
    box-shadow: 0 0 0 15px rgba(0, 255, 0, 0);
  }
`;

export const CellButton = styled.button<{
  selected: boolean;
  $revealed?: boolean;
  $revealedWin?: boolean;
  $revealedLoss?: boolean;
}>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  ${({ selected, $revealedWin, $revealedLoss }) => {
    if ($revealedWin)
      return css`
        background: #00ff00;
        animation: ${pulseAnimation} 1s infinite;
      `;
    if ($revealedLoss)
      return css`
        background: #ff6347;
      `;
    return css`
      background: ${selected ? "#9335ff" : "#9358ff"};
    `;
  }}
  border: none;
  border-bottom: ${({ selected, $revealedWin, $revealedLoss }) => {
    if ($revealedWin || $revealedLoss) return "5px solid #00000055";
    return selected ? "5px solid #00000055" : "3px solid transparent";
  }};
  border-radius: 4px;
  font-weight: bold;
  aspect-ratio: 1;
  width: 60px;
  transition:
    background 0.3s,
    opacity 0.3s,
    filter 0.2s ease;
  font-size: 12px;
  cursor: pointer;
  box-shadow: ${({ selected, $revealedWin, $revealedLoss }) => {
    if ($revealedWin || $revealedLoss) return "0 2px 4px rgba(0, 0, 0, 0.2)";
    return selected ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "none";
  }};

  ${({ selected }) =>
    selected &&
    css`
      filter: brightness(1.5);
      z-index: 10;
      opacity: 1 !important;
    `}

  &:hover:not(:disabled) {
    filter: brightness(1.5);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
