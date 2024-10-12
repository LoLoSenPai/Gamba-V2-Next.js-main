// src/utils/RecentPlay.tsx
import { BPS_PER_WHOLE, GambaTransaction } from "gamba-core-v2";
import { TokenValue, useTokenMeta } from "gamba-react-ui-v2";

import { GAMES } from "@/games";

export const extractMetadata = (event: GambaTransaction<"GameSettled">) => {
  const [version, gameId, ...rest] = event.data.metadata.split(":");
  const game = GAMES.find((x) => x.id.toLowerCase() === gameId.toLowerCase());

  if (game) {
    return {
      game: game,
      gameNameFallback: game?.meta?.name,
      isFallback: false,
    };
  } else {
    const gameNameFallback = gameId || "Unknown";
    const gameIdFallback = gameId || "unknownGame";
    return {
      game: {
        id: gameIdFallback,
        meta: {
          background: "#fff",
          name: gameNameFallback,
          image: "/logo.png",
          description: `unknown game: ${gameIdFallback}`,
          volatility: 0,
        },
      },
      gameNameFallback,
      isFallback: true,
    };
  }
};

export function RecentPlay({
  event,
}: {
  event: GambaTransaction<"GameSettled">;
}) {
  const data = event.data;
  const token = useTokenMeta(data.tokenMint);

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE;
  const wager = data.wager.toNumber();
  const payout = multiplier * wager;
  const profit = payout - wager;

  const { game, gameNameFallback, isFallback } = extractMetadata(event);

  return (
    <div className="flex items-center justify-between w-full gap-4 md:gap-6">
      <div className="flex items-center justify-center gap-2">
        {!isFallback ? (
          <img
            src={`/games/${game.id}/logo.png`}
            alt={`${game?.meta?.name} Splash`}
            className="items-center justify-center"
            width="60px"
          />
        ) : (
          <img
            src="/logo.svg"
            alt={`${gameNameFallback} Splash`}
            className="items-center justify-center"
            width="60px"
          />
        )}
      </div>
      <div
        className="flex items-center justify-center gap-2"
        style={{ color: "#a079ff" }}
      >
        {`${data.user.toBase58().substring(0, 4)}...${data.user
          .toBase58()
          .slice(-4)}`}
      </div>
      <div className="flex items-center justify-center gap-2">
        {profit >= 0 ? "WON" : "LOST"}
      </div>
      <div
        className="flex gap-2 items-center justify-center rounded-lg p-1"
        style={{ backgroundColor: profit > 0 ? "#34D399" : "#666" }}
      >
        {token.image ? (
          <img
            src={token.image}
            alt="Token"
            width={24}
            className="rounded-full flex-shrink-0"
          />
        ) : (
          <span className="inline-block w-6 h-6 border border-white rounded-full flex items-center justify-center text-xs font-medium text-white">
            {token.symbol}
          </span>
        )}
        <TokenValue amount={Math.abs(profit)} mint={data.tokenMint} />
      </div>
      <div className="hidden md:flex flex-col items-center justify-center">
        {profit > 0 && <div>({multiplier.toFixed(2)}x)</div>}
        {data.jackpotPayoutToUser.toNumber() > 0 && (
          <div className="animate-jackpotGradient flex gap-2 items-center text-black rounded-lg p-1">
            +
            <TokenValue
              mint={data.tokenMint}
              amount={data.jackpotPayoutToUser.toNumber()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
