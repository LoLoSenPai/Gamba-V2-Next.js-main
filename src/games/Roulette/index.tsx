import { CHIPS, SOUND_LOSE, SOUND_PLAY, SOUND_WIN } from "./constants";
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useSound,
  useTokenBalance,
} from "gamba-react-ui-v2";
import {
  addResult,
  bet,
  clearChips,
  results,
  selectedChip,
  totalChipValue,
} from "./signals";

import { Chip } from "./Chip";
import GambaPlayButton from "@/components/ui/GambaPlayButton";
import React from "react";
import { StyledResults } from "./Roulette.styles";
import { Table } from "./Table";
import { computed } from "@preact/signals-react";
import styled from "styled-components";
import { toast } from "sonner";
import { useGamba } from "gamba-react-v2";

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  color: white;
`;
function Results() {
  const _results = computed(() => [...results.value].reverse());
  return (
    <StyledResults>
      {_results.value.map((index, i) => {
        return <div key={i}>{index + 1}</div>;
      })}
    </StyledResults>
  );
}

function Stats() {
  const pool = useCurrentPool();
  const token = useCurrentToken();
  const balance = useTokenBalance();
  const wager = (totalChipValue.value * token.baseWager) / 10_000;

  const multiplier = Math.max(...bet.value);
  const maxPayout = multiplier * wager;
  const maxPayoutExceeded = maxPayout > pool.maxPayout;
  const balanceExceeded = wager > balance.balance + balance.bonusBalance;

  return (
    <div
      style={{
        textAlign: "center",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      <div>
        {balanceExceeded ? (
          <span style={{ color: "#ff0066" }}>TOO HIGH</span>
        ) : (
          <>
            <TokenValue amount={wager} />
          </>
        )}
        <div>Wager</div>
      </div>
      <div>
        <div>
          {maxPayoutExceeded ? (
            <span style={{ color: "#ff0066" }}>TOO HIGH</span>
          ) : (
            <>
              <TokenValue amount={maxPayout} />({multiplier.toFixed(2)}x)
            </>
          )}
        </div>
        <div>Potential win</div>
      </div>
    </div>
  );
}

export default function Roulette() {
  const game = GambaUi.useGame();
  const token = useCurrentToken();
  const pool = useCurrentPool();
  const balance = useTokenBalance();
  const gamba = useGamba();

  const sounds = useSound({
    win: SOUND_WIN,
    lose: SOUND_LOSE,
    play: SOUND_PLAY,
  });

  const wager = (totalChipValue.value * token.baseWager) / 10_000;

  const multiplier = Math.max(...bet.value);
  const maxPayout = multiplier * wager;
  const maxPayoutExceeded = maxPayout > pool.maxPayout;
  const balanceExceeded = wager > balance.balance + balance.bonusBalance;

  const play = async () => {
    try {
      results.value = [];
      sounds.play("play");

      await game.play({
        bet: bet.value,
        wager,
      });

      const result = await gamba.result();
      addResult(result.resultIndex);

      if (result.payout > 0) {
        sounds.play("win");
      } else {
        sounds.play("lose");
      }
    } catch (err: any) {
      toast.error(`An error occurred: ${err.message}`);
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <Wrapper onContextMenu={(e) => e.preventDefault()}>
            <Stats />
            <Results />
            <Table />
          </Wrapper>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.Select
          options={CHIPS}
          value={selectedChip.value}
          onChange={(value) => (selectedChip.value = value)}
          label={(value) => (
            <>
              <Chip value={value} /> ={" "}
              <TokenValue amount={token.baseWager * value} />
            </>
          )}
        />
        <GambaPlayButton
          disabled={!wager || gamba.isPlaying}
          onClick={clearChips}
          text="Clear"
        />
        <GambaPlayButton
          disabled={!wager || balanceExceeded || maxPayoutExceeded}
          onClick={play}
          text="Play"
        />
      </GambaUi.Portal>
    </>
  );
}
