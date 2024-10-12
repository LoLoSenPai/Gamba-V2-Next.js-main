// src/games/Crash/index.tsx
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useSound,
  useWagerInput,
} from "gamba-react-ui-v2";
import {
  LineLayer1,
  LineLayer10,
  LineLayer2,
  LineLayer3,
  LineLayer4,
  LineLayer5,
  LineLayer6,
  LineLayer7,
  LineLayer8,
  LineLayer9,
  MultiplierText,
  Rocket,
  ScreenWrapper,
  StarsLayer1,
  StarsLayer10,
  StarsLayer2,
  StarsLayer3,
  StarsLayer4,
  StarsLayer5,
  StarsLayer6,
  StarsLayer7,
  StarsLayer8,
  StarsLayer9,
} from "./styles";
import React, { useState } from "react";

import GambaPlayButton from "@/components/ui/GambaPlayButton";
import Slider from "./slide";
import { toast } from "sonner";
import { useGamba } from "gamba-react-v2";

const CrashGame = () => {
  const [wager, setWager] = useWagerInput();
  const [multiplierTarget, setMultiplierTarget] = useState(2);
  const [currentMultiplier, setCurrentMultiplier] = useState(0);
  const [rocketState, setRocketState] = useState<"idle" | "win" | "crash">(
    "idle",
  );
  const gamba = useGamba();
  const pool = useCurrentPool();
  const selectedToken = useCurrentToken();
  const game = GambaUi.useGame();
  const sound = useSound({
    music: "/games/crash/music.mp3",
    crash: "/games/crash/crash.mp3",
    win: "/games/crash/win.mp3",
    tick: "/games/crash/tick.mp3",
  });

  const calculateBetArray = (multiplier: number) => {
    const targetMultiplier = Math.ceil(multiplier);

    const betArray = new Array(targetMultiplier)
      .fill(0)
      .map((_, index) => (index === 0 ? multiplier : 0));
    return betArray;
  };

  const getRocketStyle = () => {
    const maxMultiplier = 1;
    const progress = Math.min(currentMultiplier / maxMultiplier, 1);

    const leftOffset = 20;
    const bottomOffset = 30;
    const left = progress * (100 - leftOffset);
    const bottom = Math.pow(progress, 5) * (100 - bottomOffset);
    const rotationProgress = Math.pow(progress, 2.3);
    const startRotationDeg = 90;
    const rotation = (1 - rotationProgress) * startRotationDeg;

    return {
      bottom: `${bottom}%`,
      left: `${left}%`,
      transform: `rotate(${rotation}deg)`,
    };
  };

  const doTheIntervalThing = (
    currentMultiplier: number,
    targetMultiplier: number,
    win: boolean,
  ) => {
    const nextIncrement = 0.01 * (Math.floor(currentMultiplier) + 1);
    const nextValue = currentMultiplier + nextIncrement;

    setCurrentMultiplier(nextValue);

    if (nextValue >= targetMultiplier) {
      sound.sounds.music.player.stop();
      sound.play(win ? "win" : "crash");
      setRocketState(win ? "win" : "crash");
      setCurrentMultiplier(targetMultiplier);
      return;
    }

    setTimeout(() => doTheIntervalThing(nextValue, targetMultiplier, win), 50);
  };

  const calculateBiasedLowMultiplier = (targetMultiplier: number) => {
    const randomValue = Math.random();
    const maxPossibleMultiplier = Math.min(targetMultiplier, 12);
    const exponent = randomValue > 0.95 ? 2.8 : targetMultiplier > 10 ? 5 : 6;
    let result =
      1 + Math.pow(randomValue, exponent) * (maxPossibleMultiplier - 1);

    const minThreshold = targetMultiplier * 0.02;

    const randomMultiplier =
      minThreshold + Math.random() * (targetMultiplier * 0.03);

    result = Math.max(result, randomMultiplier);
    return parseFloat(result.toFixed(2));
  };

  const multiplierColor = (() => {
    if (rocketState === "crash") return "#ff0000";
    if (rocketState === "win") return "#00ff00";
    return "#ffffff";
  })();

  const play = async () => {
    try {
      setRocketState("idle");
      setCurrentMultiplier(0);

      const bet = calculateBetArray(multiplierTarget);
      await game.play({ wager, bet });

      const result = await game.result();
      const win = result.payout > 0;

      const multiplierResult = win
        ? multiplierTarget
        : calculateBiasedLowMultiplier(multiplierTarget);

      sound.play("music");

      doTheIntervalThing(0, multiplierResult, win);
    } catch (err: any) {
      toast.error(`An error occurred: ${err.message}`);
      setRocketState("idle");
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <ScreenWrapper>
          <StarsLayer1 style={{ opacity: currentMultiplier > 5 ? 0 : 1 }} />
          <LineLayer1 style={{ opacity: currentMultiplier > 5 ? 1 : 0 }} />
          <StarsLayer2 style={{ opacity: currentMultiplier > 4.5 ? 0 : 1 }} />
          <LineLayer2 style={{ opacity: currentMultiplier > 4.5 ? 1 : 0 }} />
          <StarsLayer3 style={{ opacity: currentMultiplier > 4 ? 0 : 1 }} />
          <LineLayer3 style={{ opacity: currentMultiplier > 4 ? 1 : 0 }} />
          <StarsLayer4 style={{ opacity: currentMultiplier > 3.5 ? 0 : 1 }} />
          <LineLayer4 style={{ opacity: currentMultiplier > 3.5 ? 1 : 0 }} />
          <StarsLayer5 style={{ opacity: currentMultiplier > 3 ? 0 : 1 }} />
          <LineLayer5 style={{ opacity: currentMultiplier > 3 ? 1 : 0 }} />
          <StarsLayer6 style={{ opacity: currentMultiplier > 2.5 ? 0 : 1 }} />
          <LineLayer6 style={{ opacity: currentMultiplier > 2.5 ? 1 : 0 }} />
          <StarsLayer7 style={{ opacity: currentMultiplier > 2 ? 0 : 1 }} />
          <LineLayer7 style={{ opacity: currentMultiplier > 2 ? 1 : 0 }} />
          <StarsLayer8 style={{ opacity: currentMultiplier > 1.5 ? 0 : 1 }} />
          <LineLayer8 style={{ opacity: currentMultiplier > 1.5 ? 1 : 0 }} />
          <StarsLayer9 style={{ opacity: currentMultiplier > 1 ? 0 : 1 }} />
          <LineLayer9 style={{ opacity: currentMultiplier > 1 ? 1 : 0 }} />
          <StarsLayer10 style={{ opacity: currentMultiplier > 0.5 ? 0 : 1 }} />
          <LineLayer10 style={{ opacity: currentMultiplier > 0.5 ? 1 : 0 }} />

          <MultiplierText color={multiplierColor}>
            {currentMultiplier.toFixed(2)}x
          </MultiplierText>
          <div
            style={{
              position: "absolute",
              bottom: "30%",
              left: "0",
              right: "0",
              maxWidth: "300px",
              display: "flex",
              flexDirection: "column",
              margin: "auto",
              justifyContent: "center",
              alignItems: "center",
              transition: "all 0.5s ease-in-out",
            }}
          >
            <div className="flex gap-4 justify-between items-center mx-auto">
              <div className="flex flex-col justify-between items-center mx-auto">
                <div
                  style={{
                    fontSize: "1.5vh",
                    fontWeight: "bold",
                  }}
                >
                  {`${(multiplierTarget > 1 ? 1 / multiplierTarget : 0).toFixed(
                    3,
                  )}%`}
                </div>
                <div
                  style={{
                    fontSize: "1.5vh",
                    marginBottom: "2vh",
                  }}
                >
                  Win Chance
                </div>
              </div>

              <div className="flex flex-col justify-between items-center mx-auto">
                <div
                  style={{
                    fontSize: "1.5vh",
                    fontWeight: "bold",
                  }}
                >
                  {multiplierTarget}x
                </div>
                <div
                  style={{
                    fontSize: "1.5vh",
                    marginBottom: "2vh",
                  }}
                >
                  Multiplier
                </div>
              </div>

              <div className="flex flex-col justify-between items-center mx-auto">
                <div
                  style={{
                    fontSize: "1.5vh",
                    fontWeight: "bold",
                  }}
                >
                  <TokenValue
                    mint={pool.token}
                    suffix={selectedToken?.symbol}
                    amount={wager * multiplierTarget}
                  />
                </div>
                <div
                  style={{
                    fontSize: "1.5vh",
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
              value={multiplierTarget}
              onChange={(value: number) => {
                setMultiplierTarget(value);
                sound.play("tick");
              }}
            />
          </div>

          <Rocket style={getRocketStyle()} />
        </ScreenWrapper>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaPlayButton disabled={!wager} onClick={play} text="Play" />
      </GambaUi.Portal>
    </>
  );
};

export default CrashGame;
