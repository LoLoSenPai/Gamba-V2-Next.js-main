// src/games/Limbo/index.tsx
/*
 * Author: BankkRoll
 */

import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useSound,
  useWagerInput,
} from "gamba-react-ui-v2";
import React, { useState } from "react";

import GambaPlayButton from "@/components/ui/GambaPlayButton";
import Slider from "./slide";
import { toast } from "sonner";
import { useGamba } from "gamba-react-v2";

export default function Limbo() {
  const game = GambaUi.useGame();
  const gamba = useGamba();
  const [wager, setWager] = useWagerInput();
  const [targetMultiplier, setTargetMultiplier] = useState<number>(20);
  const [resultMultiplier, setResultMultiplier] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const pool = useCurrentPool();
  const selectedToken = useCurrentToken();

  const sounds = useSound({
    spin: "/games/limbo/numbers.mp3",
    win: "/games/limbo/win.mp3",
    lose: "/games/limbo/lose.mp3",
    tick: "/games/limbo/tick.mp3",
  });

  const handleMultiplierChange = (value: number) => {
    setTargetMultiplier(Math.max(2, Math.min(100, value)));
    sounds.play("tick");
  };

  const startAnimation = (
    start: number,
    end: number,
    winCondition: boolean,
  ) => {
    let startTime: number | null = null;
    const duration = 2500;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setResultMultiplier(start + (end - start) * progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTextColor(winCondition ? "#10B981" : "#EF4444");
        sounds.play(winCondition ? "win" : "lose");
      }
    };

    requestAnimationFrame(animate);
  };

  const play = async () => {
    try {
      setPlaying(true);
      setResultMultiplier(0);
      setTextColor("#FFFFFF");

      await game.play({
        bet: new Array(targetMultiplier)
          .fill(0)
          .map((_, index) => (index === 0 ? targetMultiplier : 0)),
        wager: wager,
      });

      const result = await game.result();

      const winCondition = result.multiplier >= targetMultiplier;
      setIsWin(winCondition);
      sounds.play("spin", { playbackRate: 0.8 });

      const endMultiplier = winCondition
        ? targetMultiplier + Math.random() * targetMultiplier * 0.2
        : 1 + Math.random() * (targetMultiplier - 1);

      setTimeout(() => startAnimation(1, endMultiplier, winCondition), 500);
    } catch (err: any) {
      toast.error(`An error occurred: ${err.message}`);
    } finally {
      setPlaying(false);
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
              justifyContent: "center",
              alignItems: "center",
              height: "500px",
              transition: "all 0.5s ease-in-out",
            }}
          >
            <div
              style={{
                fontSize: "10rem",
                fontWeight: "bold",
                color: textColor,
                transition: "color 0.5s ease-in-out",
              }}
            >
              {resultMultiplier.toFixed(2)}x
            </div>
            <div className="flex gap-4 justify-between items-center mx-auto">
              <div className="flex flex-col justify-between items-center mx-auto">
                <div
                  style={{
                    fontSize: "2vh",
                    fontWeight: "bold",
                    color: textColor,
                    transition: "color 0.5s ease-in-out",
                  }}
                >
                  {targetMultiplier}%
                </div>
                <div
                  style={{
                    fontSize: "2vh",
                    color: textColor,
                    marginBottom: "2vh",
                  }}
                >
                  Win Chance
                </div>
              </div>

              <div className="flex flex-col justify-between items-center mx-auto">
                <div
                  style={{
                    fontSize: "2vh",
                    fontWeight: "bold",
                    color: textColor,
                    transition: "color 0.5s ease-in-out",
                  }}
                >
                  {targetMultiplier}x
                </div>
                <div
                  style={{
                    fontSize: "2vh",
                    color: textColor,
                    marginBottom: "2vh",
                  }}
                >
                  Multiplier
                </div>
              </div>

              <div className="flex flex-col justify-between items-center mx-auto">
                <div
                  style={{
                    fontSize: "2vh",
                    fontWeight: "bold",
                    color: textColor,
                    transition: "color 0.5s ease-in-out",
                  }}
                >
                  <TokenValue
                    mint={pool.token}
                    suffix={selectedToken?.symbol}
                    amount={targetMultiplier * wager}
                  />
                </div>
                <div
                  style={{
                    fontSize: "2vh",
                    color: textColor,
                    marginBottom: "2vh",
                  }}
                >
                  Payout
                </div>
              </div>
            </div>
            <Slider
              disabled={gamba.isPlaying}
              range={[2, 100]}
              min={2}
              max={100}
              value={targetMultiplier}
              onChange={handleMultiplierChange}
            />
          </div>
        </GambaUi.Responsive>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaPlayButton
          onClick={play}
          disabled={playing}
          text={playing ? "Playing..." : "Play"}
        />
      </GambaUi.Portal>
    </>
  );
}
