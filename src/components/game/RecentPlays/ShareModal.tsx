// src/components/sections/RecentPlays/ShareModal.tsx

import React, { useRef, useState } from "react";
import { TokenValue, useTokenMeta } from "gamba-react-ui-v2";

import { GambaButton } from "@/components/ui/GambaPlayButton";
import { GambaTransaction } from "gamba-core-v2";
import { Modal } from "@/components/ui/Modal";
import { extractMetadata } from "@/utils/RecentPlay";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useRouter } from "next/router";

const canvasToClipboard = async (canvas: HTMLCanvasElement) => {
  const minDelay = new Promise((resolve) => setTimeout(resolve, 300));

  const clipboardCopy = new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error("Canvas to Blob conversion failed"));
      }
      navigator.clipboard
        .write([new ClipboardItem({ "image/png": blob })])
        .then(resolve)
        .catch(reject);
    });
  });

  await Promise.all([minDelay, clipboardCopy]);
};

export function ShareModal({
  event,
  onClose,
}: {
  event: GambaTransaction<"GameSettled">;
  onClose: () => void;
}) {
  const router = useRouter();
  const tokenMeta = useTokenMeta(event.data.tokenMint);
  const ref = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);
  const [shutterActive, setShutterActive] = useState(false);
  const profit = event.data.payout.sub(event.data.wager).toNumber();
  const percentChange = profit / event.data.wager.toNumber();
  const { game, isFallback } = extractMetadata(event);
  const imagePath = isFallback ? "/logo.svg" : `/games/${game.id}/logo.png`;

  const gotoGame = () => {
    router.push(`/play/${game?.id}`);
    onClose();
  };

  const copyImage = async () => {
    if (ref.current) {
      try {
        setCopying(true);
        setShutterActive(true);
        const canvas = await html2canvas(ref.current, {
          removeContainer: true,
          backgroundColor: "transparent",
          useCORS: true,
          logging: true,
        });
        await canvasToClipboard(canvas);
        toast.success(
          "📋 Copied image to clipboard. You can paste it in Twitter or Telegram etc.",
        );
      } finally {
        setShutterActive(false);
        setCopying(false);
      }
    }
  };

  if (!game) {
    return null;
  }

  if (!game) {
    return null;
  }

  return (
    <Modal onClose={() => onClose()}>
      <div className="mt-6 grid gap-2.5 pb-0 w-full">
        <div className="rounded-lg overflow-hidden">
          <div
            ref={ref}
            className="border-2 relative bg-gradient-to-br from-blue-800 to-purple-800 rounded-lg overflow-hidden shadow-3xl transform transition duration-500"
          >
            {shutterActive && (
              <div className="overflow-hidden absolute inset-0 flex justify-center items-center">
                <div className="animate-shutter" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 transform rotate-12 scale-150 blur-xl pointer-events-none"></div>

            <div className="p-5 bg-black bg-opacity-40">
              <div className="grid grid-cols-2 items-center gap-4">
                <div className="col-span-1">
                  {imagePath && (
                    <img
                      src={imagePath}
                      alt="Game Image"
                      className="h-full w-full"
                    />
                  )}
                  <div
                    className={`text-3xl md:text-5xl font-extrabold ${
                      percentChange >= 0 ? "text-green-400" : "text-red-400"
                    } transition-colors duration-300`}
                  >
                    {profit >= 0 ? "+" : "-"}
                    {(Math.abs(percentChange) * 100).toFixed(2)}%
                  </div>
                </div>

                <div className="flex flex-col justify-between items-center gap-4">
                  <div className="flex flex-col whitespace-nowrap">
                    <h3 className="mb-[0.1rem] text-left text-xs font-semibold text-gray-400">
                      WAGER
                    </h3>
                    <div className="md:min-w-full flex justify-between items-center gap-1 text-sm md:text-xl font-bold text-gray-500 transition-colors duration-300">
                      <img
                        src={tokenMeta.image}
                        alt="Token Image"
                        className="rounded-full border-2 border-gray-700 h-4 w-4 md:h-5 md:w-5"
                        crossOrigin="anonymous"
                      />
                      <TokenValue
                        exact
                        amount={event.data.wager}
                        mint={event.data.tokenMint}
                      />
                    </div>

                    <h3 className="mb-[0.1rem] text-left text-xs font-semibold text-gray-400">
                      PAYOUT
                    </h3>
                    <div
                      className={`md:min-w-full flex justify-between  items-center gap-1 text-sm md:text-xl font-bold ${
                        profit >= 0 ? "text-green-500" : "text-red-500"
                      } transition-colors duration-300`}
                    >
                      <img
                        src={tokenMeta.image}
                        alt="Token Image"
                        className="rounded-full border-2 border-gray-700 h-4 w-4 md:h-5 md:w-5"
                        crossOrigin="anonymous"
                      />
                      {profit >= 0 ? "+" : " "}
                      <TokenValue
                        exact
                        amount={event.data.payout}
                        mint={event.data.tokenMint}
                      />
                    </div>

                    <h3 className="mb-[0.1rem] text-left text-xs font-semibold text-gray-400">
                      PROFIT
                    </h3>
                    <div
                      className={`md:min-w-full flex justify-between items-center gap-1 text-sm md:text-xl font-bold ${
                        profit >= 0 ? "text-green-500" : "text-red-500"
                      } transition-colors duration-300`}
                    >
                      <img
                        src={tokenMeta.image}
                        alt="Token Image"
                        className="rounded-full border-2 border-gray-700 h-4 w-4 md:h-5 md:w-5"
                        crossOrigin="anonymous"
                      />
                      {profit >= 0 ? "+" : "-"}
                      <TokenValue
                        exact
                        amount={Math.abs(profit)}
                        mint={event.data.tokenMint}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-4" />
              <div className="mt-4 items-center justify-center flex">
                <img src="/logo.svg" className="h-6 w-auto" alt="Gamba" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <GambaButton
            onClick={() =>
              window.open(
                `https://explorer.gamba.so/tx/${event.signature}`,
                "_blank",
              )
            }
            text="Verify"
          />

          {!isFallback && (
            <GambaButton onClick={gotoGame} text={`Play ${game?.meta?.name}`} />
          )}

          <GambaButton onClick={copyImage} text="Share" />
        </div>
      </div>
    </Modal>
  );
}
