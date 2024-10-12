// src/games/Mines/index.tsx
import {
  CellButton,
  Container,
  Container2,
  Grid,
  Level,
  Levels,
  StatusBar,
} from "./styles";
import {
  GRID_SIZE,
  MINE_SELECT,
  PITCH_INCREASE_FACTOR,
  SOUND_EXPLODE,
  SOUND_FINISH,
  SOUND_STEP,
  SOUND_TICK,
  SOUND_WIN,
} from "./constants";
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useSound,
  useWagerInput,
} from "gamba-react-ui-v2";
import React, { useMemo, useState } from "react";
import { generateGrid, revealAllMines, revealGold } from "./utils";

import { BPS_PER_WHOLE } from "gamba-core-v2";
import GambaPlayButton from "@/components/ui/GambaPlayButton";
import { toast } from "sonner";
import { useGamba } from "gamba-react-v2";

function Mines() {
  const game = GambaUi.useGame();
  const gamba = useGamba();
  const sounds = useSound({
    tick: SOUND_TICK,
    win: SOUND_WIN,
    finish: SOUND_FINISH,
    step: SOUND_STEP,
    explode: SOUND_EXPLODE,
  });

  const pool = useCurrentPool();

  const [grid, setGrid] = useState(generateGrid(GRID_SIZE));
  const [currentLevel, setLevel] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [totalGain, setTotalGain] = useState(0);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const [initialWager, setInitialWager] = useWagerInput();
  const [mines, setMines] = useState(MINE_SELECT[2]);

  const getMultiplierForLevel = (level: number) => {
    const remainingCells = GRID_SIZE - level;
    return (
      Number(
        BigInt(remainingCells * BPS_PER_WHOLE) / BigInt(remainingCells - mines),
      ) / BPS_PER_WHOLE
    );
  };

  const levels = useMemo(() => {
    const totalLevels = GRID_SIZE - mines;
    let cumProfit = 0;
    let previousBalance = initialWager;

    return Array.from({ length: totalLevels })
      .map((_, level) => {
        const wager = level === 0 ? initialWager : previousBalance;
        const multiplier = getMultiplierForLevel(level);
        const remainingCells = GRID_SIZE - level;
        const bet = Array.from({ length: remainingCells }, (_, i) =>
          i < mines ? 0 : multiplier,
        );

        const profit = wager * (multiplier - 1);
        cumProfit += profit;
        const balance = wager + profit;

        previousBalance = balance;
        return { bet, wager, profit, cumProfit, balance };
      })
      .filter((x) => Math.max(...x.bet) * x.wager < pool.maxPayout);
  }, [initialWager, mines, pool.maxPayout]);

  const remainingCells = GRID_SIZE - currentLevel;
  const gameFinished = remainingCells <= mines;
  const canPlay = started && !loading && !gameFinished;

  const { wager, bet } = levels[currentLevel] ?? {};

  const start = () => {
    setGrid(generateGrid(GRID_SIZE));
    setLoading(false);
    setLevel(0);
    setTotalGain(0);
    setStarted(true);
  };

  const endGame = async () => {
    sounds.play("finish");
    reset();
  };

  const reset = () => {
    setGrid(generateGrid(GRID_SIZE));
    setLoading(false);
    setLevel(0);
    setTotalGain(0);
    setStarted(false);
  };

  const play = async (cellIndex: number) => {
    setLoading(true);
    setSelected(cellIndex);
    try {
      sounds.sounds.step.player.loop = true;
      sounds.play("step", {});
      sounds.sounds.tick.player.loop = true;
      sounds.play("tick", {});

      await game.play({
        bet,
        wager,
        metadata: [currentLevel],
      });

      const result = await gamba.result();

      sounds.sounds.tick.player.stop();

      if (result.payout === 0) {
        setStarted(false);
        setGrid(revealAllMines(grid, cellIndex, mines));
        sounds.play("explode");
        return;
      }

      const nextLevel = currentLevel + 1;
      setLevel(nextLevel);
      setGrid(revealGold(grid, cellIndex, result.profit));
      setTotalGain(result.payout);

      if (nextLevel < GRID_SIZE - mines) {
        sounds.play("win", {
          playbackRate: Math.pow(PITCH_INCREASE_FACTOR, currentLevel),
        });
      } else {
        sounds.play("win", { playbackRate: 0.9 });
        sounds.play("finish");
      }
    } catch (err: any) {
      toast.error(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
      setSelected(-1);
      sounds.sounds.tick.player.stop();
      sounds.sounds.step.player.stop();
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <Container2>
          <Levels>
            {levels.map(({ cumProfit }, i) => {
              return (
                <Level key={i} $active={currentLevel === i}>
                  <div>LEVEL {i + 1}</div>
                  <div>
                    <TokenValue amount={cumProfit} />
                  </div>
                </Level>
              );
            })}
          </Levels>
          <StatusBar>
            <div>
              <span>Mines: {mines}</span>
              {totalGain > 0 && (
                <span>
                  +<TokenValue amount={totalGain} /> +
                  {Math.round((totalGain / initialWager) * 100 - 100)}%
                </span>
              )}
            </div>
          </StatusBar>
          <GambaUi.Responsive>
            <Container>
              <Grid>
                {grid.map((cell, index) => (
                  <CellButton
                    key={index}
                    status={cell.status}
                    selected={selected === index}
                    onClick={() => play(index)}
                    disabled={!canPlay || cell.status !== "hidden"}
                  >
                    {cell.status === "gold" && (
                      <div>
                        +<TokenValue amount={cell.profit} />
                      </div>
                    )}
                  </CellButton>
                ))}
              </Grid>
            </Container>
          </GambaUi.Responsive>
        </Container2>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        {!started ? (
          <>
            <GambaUi.WagerInput
              value={initialWager}
              onChange={setInitialWager}
            />
            <GambaUi.Select
              options={MINE_SELECT}
              value={mines}
              onChange={setMines}
              label={(mines) => <>{mines} Mines</>}
            />
            <GambaPlayButton onClick={start} text="Play" />
          </>
        ) : (
          <GambaPlayButton
            onClick={endGame}
            text={totalGain > 0 ? "Finish" : "Reset"}
          />
        )}
      </GambaUi.Portal>
    </>
  );
}

export default Mines;
