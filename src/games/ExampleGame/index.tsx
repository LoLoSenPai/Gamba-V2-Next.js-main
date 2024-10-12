import { GambaUi, useWagerInput } from "gamba-react-ui-v2";
import React, { useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function ExampleGame() {
  const game = GambaUi.useGame();
  const [side, setSide] = useState("Heads");
  const [wager, setWager] = useWagerInput();
  const [gameState, setGameState] = useState("idle");

  const walletModal = useWalletModal();
  const wallet = useWallet();

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  const play = async () => {
    try {
      setGameState("flipping");

      await game.play({
        wager,
        bet: side === "Heads" ? [2, 0] : [0, 2],
      });
      const result = await game.result();

      if (result.payout > 0) {
        setGameState("win");
      } else {
        setGameState("loss");
      }
    } catch (error) {
      console.error("Error:", error);
      setGameState("error");
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "1rem",
            }}
          >
            {gameState === "idle" && (
              <p>
                Welcome to Coin Flip! Choose your side, Place your wager and
                flip for double or nothing!
              </p>
            )}
            {gameState === "flipping" && <p>Flipping the coin...</p>}
            {gameState === "win" && <p>Congratulations! You won!</p>}
            {gameState === "loss" && <p>Unlucky! You lost. Try again?</p>}
            {gameState === "error" && (
              <p>Error: Something went wrong during the game.</p>
            )}
            <GambaUi.Button
              disabled={gameState === "flipping"}
              onClick={() => setSide(side === "Heads" ? "Tails" : "Heads")}
            >
              {side}
            </GambaUi.Button>
          </div>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        {wallet.connected ? (
          <GambaUi.PlayButton
            onClick={play}
            disabled={gameState === "flipping"}
          >
            Flip
          </GambaUi.PlayButton>
        ) : (
          <GambaUi.Button main onClick={connect}>
            Connect
          </GambaUi.Button>
        )}
      </GambaUi.Portal>
    </>
  );
}
