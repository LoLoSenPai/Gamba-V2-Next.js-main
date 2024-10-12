// src/games/Slots/index.tsx
import {
  EffectTest,
  GambaUi,
  TokenValue,
  useCurrentPool,
  useSound,
  useWagerInput,
} from "gamba-react-ui-v2";
import {
  FINAL_DELAY,
  LEGENDARY_THRESHOLD,
  NUM_SLOTS,
  REVEAL_SLOT_DELAY,
  SLOT_ITEMS,
  SOUND_LOSE,
  SOUND_PLAY,
  SOUND_REVEAL,
  SOUND_REVEAL_LEGENDARY,
  SOUND_SPIN,
  SOUND_WIN,
  SPIN_DELAY,
  SlotItem,
} from "./constants";
import React, { FC, useEffect, useMemo, useState } from "react";
import { generateBetArray, getSlotCombination } from "./utils";

import GambaPlayButton from "@/components/ui/GambaPlayButton";
import { GameResult } from "gamba-core-v2";
import { ItemPreview } from "./ItemPreview";
import { Slot } from "./Slot";
import { StyledSlots } from "./Slots.styles";
import { toast } from "sonner";
import { useGamba } from "gamba-react-v2";

const Messages: FC<{ messages: string[] }> = ({ messages }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  useEffect(() => {
    const timeout = setInterval(() => {
      setMessageIndex((x) => (x + 1) % messages.length);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [messages]);
  return <>{messages[messageIndex]}</>;
};

export default function Slots() {
  const gamba = useGamba();
  const game = GambaUi.useGame();
  const pool = useCurrentPool();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<GameResult>();
  const [good, setGood] = useState(false);
  const [revealedSlots, setRevealedSlots] = useState(NUM_SLOTS);
  const [wager, setWager] = useWagerInput();
  const [combination, setCombination] = useState(
    Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[0]),
  );

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    reveal: SOUND_REVEAL,
    revealLegendary: SOUND_REVEAL_LEGENDARY,
    spin: SOUND_SPIN,
    play: SOUND_PLAY,
  });

  const bet = useMemo(
    () => generateBetArray(pool.maxPayout, wager),
    [pool.maxPayout, wager, gamba.nonce],
  );

  const valid = bet.some((x) => x > 1);

  const revealSlot = (combination: SlotItem[], slot = 0) => {
    sounds.play("reveal", { playbackRate: 1.1 });

    const allSame = combination
      .slice(0, slot + 1)
      .every((item, index, arr) => !index || item === arr[index - 1]);

    if (combination[slot].multiplier >= LEGENDARY_THRESHOLD) {
      if (allSame) {
        sounds.play("revealLegendary");
      }
    }

    setRevealedSlots(slot + 1);

    if (slot === NUM_SLOTS - 1) {
      sounds.sounds.spin.player.stop();
      setTimeout(() => {
        setSpinning(false);
        if (allSame) {
          setGood(true);
          sounds.play("win");
        } else {
          sounds.play("lose");
        }
      }, FINAL_DELAY);
    }

    if (slot < NUM_SLOTS - 1) {
      setTimeout(() => revealSlot(combination, slot + 1), REVEAL_SLOT_DELAY);
    }
  };

  const play = async () => {
    try {
      setSpinning(true);
      setResult(undefined);

      await game.play({
        wager,
        bet,
      });

      sounds.play("play");

      setRevealedSlots(0);
      setGood(false);

      const startTime = Date.now();

      sounds.play("spin", { playbackRate: 0.5 });

      const result = await gamba.result();

      const resultDelay = Date.now() - startTime;
      const revealDelay = Math.max(0, SPIN_DELAY - resultDelay);

      const combination = getSlotCombination(NUM_SLOTS, result.multiplier, bet);

      setCombination(combination);

      setResult(result);

      setTimeout(() => revealSlot(combination), revealDelay);
    } catch (err: any) {
      toast.error(`An error occurred: ${err.message}`);
      setSpinning(false);
      setRevealedSlots(NUM_SLOTS);
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        {good && <EffectTest src={combination[0].image} />}
        <GambaUi.Responsive>
          <StyledSlots>
            <div>
              <ItemPreview betArray={bet} />
              <div className={"slots"}>
                {combination.map((slot, i) => (
                  <Slot
                    key={i}
                    index={i}
                    revealed={revealedSlots > i}
                    item={slot}
                    good={good}
                  />
                ))}
              </div>
              <div className="result" data-good={good}>
                {spinning ? (
                  <Messages messages={["Spinning!", "Good luck"]} />
                ) : result ? (
                  <>
                    Payout:{" "}
                    <TokenValue mint={result.token} amount={result.payout} />
                  </>
                ) : valid ? (
                  <Messages messages={["SPIN ME!", "FEELING LUCKY?"]} />
                ) : (
                  <>❌ Choose a lower wager!</>
                )}
              </div>
            </div>
          </StyledSlots>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaPlayButton disabled={!valid} onClick={play} text="Spin" />
      </GambaUi.Portal>
    </>
  );
}
