// src/components/sections/RecentPlays/useRecentPlays.ts

import { useGambaEventListener, useGambaEvents } from "gamba-react-v2";
import { useMemo, useState } from "react";

import { GambaTransaction } from "gamba-core-v2";
import { useRouter } from "next/router";
import { PublicKey } from "@solana/web3.js";

const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_PLATFORM_CREATOR as string,
);

export function useRecentPlays(platformOnly = false) {
  const router = useRouter();

  const eventFilter = platformOnly ? { address: PLATFORM_CREATOR_ADDRESS } : {};
  const previousEvents = useGambaEvents("GameSettled", eventFilter);

  const [newEvents, setNewEvents] = useState<GambaTransaction<"GameSettled">[]>(
    [],
  );

  useGambaEventListener(
    "GameSettled",
    (event: GambaTransaction<"GameSettled">) => {
      if (
        platformOnly &&
        !event.data.creator.equals(PLATFORM_CREATOR_ADDRESS)
      ) {
        return;
      }

      const eventExists = newEvents.some(
        (e) => e.signature === event.signature,
      );

      if (!eventExists) {
        setNewEvents((prevEvents) => [event, ...prevEvents]);
      }
    },
    [router.pathname, platformOnly],
  );

  const combinedEvents = useMemo(() => {
    const allEvents = [...newEvents, ...previousEvents];
    const uniqueEvents = allEvents.filter(
      (event, index, self) =>
        index === self.findIndex((e) => e.signature === event.signature),
    );
    return uniqueEvents.sort((a, b) => b.time - a.time);
  }, [newEvents, previousEvents]);

  return combinedEvents;
}
