// src/hooks/useGameEvent.ts
import { BPS_PER_WHOLE, GambaTransaction } from "gamba-core-v2";
import { TokenValue, useTokenMeta } from "gamba-react-ui-v2";

import Link from "next/link";
import { extractMetadata } from "@/utils/RecentPlay";
import { toast } from "sonner";
import { useGambaEventListener } from "gamba-react-v2";
import { useWallet } from "@solana/wallet-adapter-react";

function RecentPlay({ event }: { event: GambaTransaction<"GameSettled"> }) {
  const data = event.data;
  const token = useTokenMeta(data.tokenMint);

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE;
  const wager = data.wager.toNumber();
  const payout = multiplier * wager;
  const profit = payout + data.jackpotPayoutToUser.toNumber() - wager;

  const { game } = extractMetadata(event);

  if (!game || !token) {
    return null;
  }

  const textColorClass = profit >= 0 ? "text-green-600" : "text-red-600";

  return (
    <>
      <img src={`/games/${game.id}/logo.png`} alt={"Splash"} className="h-10" />
      <div className={textColorClass}>
        <img
          src="/logo.svg"
          alt="gamba"
          className="absolute top-2 right-2 w-24 h-6 rounded-full"
        />
        <div className="font-bold text-lg">
          {data.user.toBase58().substring(0, 4)}...{" "}
          <span className="text-sm">{profit >= 0 ? "WON" : "LOST"}</span>{" "}
          <TokenValue amount={Math.abs(profit)} mint={data.tokenMint} />
        </div>
        <div className="whitespace-nowrap flex items-center gap-2 mt-2">
          {token.image ? (
            <img
              src={token.image}
              alt={`${token.name}`}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <span className="inline-block w-6 h-6 border border-white rounded-full items-center justify-center text-xs font-medium text-white">
              <span className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
                {token.symbol}
              </span>
            </span>
          )}
          {profit >= 0 && (
            <>
              <span className={`text-sm font-semibold text-green-600`}>
                +
                <TokenValue
                  amount={data.payout.toNumber()}
                  mint={data.tokenMint}
                />
              </span>
              <span className="text-xs font-medium text-gray-500">
                ({multiplier.toFixed(2)}x)
              </span>
            </>
          )}
        </div>
        {data.jackpotPayoutToUser.toNumber() > 0 && (
          <div className="mt-2 animate-jackpotGradient flex items-center gap-2 text-black rounded-lg p-1">
            +
            <TokenValue
              mint={data.tokenMint}
              amount={data.jackpotPayoutToUser.toNumber()}
            />
          </div>
        )}
        <div className="flex flex-row gap-2 absolute bottom-2 right-2">
          <a
            href={`https://explorer.gamba.so/tx/${event.signature}`}
            target="_blank"
            rel="noreferrer"
          >
            <button className="bg-[#8851ff] hover:bg-[#9564ff] text-xs rounded-lg p-1">
              Verify
            </button>
          </a>
          <Link href={`/play/${game.id}`} passHref>
            <button className="bg-[#8851ff] hover:bg-[#9564ff] text-xs rounded-lg p-1">
              Play
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

const GameToast = () => {
  const { publicKey } = useWallet();

  useGambaEventListener("GameSettled", (event) => {
    const { game } = extractMetadata(event);

    // - Filter events by a specific creator
    // - To enable filtering by a specific creator, uncomment the following lines and
    // - this will auto filter your events from your platform only.

    // const allowedCreator = PLATFORM_CREATOR_ADDRESS;
    // const eventCreatorPublicKeyString = event.data.creator.toBase58();

    // - Swap the line below to add the filter
    // if (game && (allowedCreator.includes(eventCreatorPublicKeyString)) ) {
    if (game) {
      const connectedUserPublicKeyString = publicKey?.toString();
      const eventUserPublicKeyString = event.data.user.toBase58();

      if (
        !publicKey ||
        eventUserPublicKeyString !== connectedUserPublicKeyString
      ) {
        const isGameWon = event.data.payout.toNumber() > 0;
        const toastType = isGameWon ? toast.success : toast.error;

        toastType(<RecentPlay event={event} />, {
          duration: 5000,
          position: "bottom-right",
        });
      }
    }
  });

  return null;
};

export default GameToast;
