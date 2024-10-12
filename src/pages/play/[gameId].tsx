// src/pages/play/[gameId].tsx

import CustomRenderer, {
  CustomError,
  GameSlider,
} from "@/components/game/GameRenderer";
import React, { useEffect, useState } from "react";

import { BASE_SEO_CONFIG } from "../../constants";
import { GAMES } from "@/games";
import { GambaUi } from "gamba-react-ui-v2";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const GamePage: React.FC = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [currentGameId, setCurrentGameId] = useState(gameId as string);
  const [isLoading, setIsLoading] = useState(true);

  const game = GAMES.find((x) => x.id === gameId);
  const gameName = game?.meta?.name;
  const imagePath = `/games/${gameId}/logo.png`;

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };
    const handleRouteChangeComplete = () => {
      setIsLoading(false);
      setCurrentGameId(gameId as string);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    if (gameId) {
      setIsLoading(false);
      setCurrentGameId(gameId as string);
    }

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [gameId, router.events]);

  return (
    <>
      <NextSeo
        title={`${BASE_SEO_CONFIG.defaultTitle} | ${gameName}`}
        description={BASE_SEO_CONFIG.description}
        canonical={`${BASE_SEO_CONFIG.openGraph.url}/${currentGameId}`}
        openGraph={{
          ...BASE_SEO_CONFIG.openGraph,
          title: `${BASE_SEO_CONFIG.defaultTitle} | ${gameName}`,
          url: `${BASE_SEO_CONFIG.openGraph.url}/${currentGameId}`,
          description: BASE_SEO_CONFIG.openGraph.description,
          images: [
            {
              url: `${BASE_SEO_CONFIG.openGraph.url}/${imagePath}`,
              alt: `${BASE_SEO_CONFIG.defaultTitle} | ${gameName}`,
            },
          ],
        }}
        twitter={BASE_SEO_CONFIG.twitter}
        additionalMetaTags={BASE_SEO_CONFIG.additionalMetaTags}
      />

      {isLoading ? (
        <div className="bg-black mt-20 flex flex-col justify-center items-center mx-auto max-w-sm md:max-w-6xl pb-1 min-h-[580px] md:min-h-[650px] rounded-lg shadow-xl">
          <div className="flex flex-col justify-center items-center max-w-lg rounded-lg">
            <video
              src="/gamba.mp4"
              className="w-full h-full"
              autoPlay
              muted
              playsInline
              loop
            />
            <p className="text-2xl text-white mt-5">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {game ? (
            <div className="flex flex-col justify-center items-center mx-auto max-w-6xl max-sm:max-w-sm pt-20">
              <GambaUi.Game game={game} errorFallback={<CustomError />}>
                <CustomRenderer />
              </GambaUi.Game>
            </div>
          ) : (
            <div className="bg-black mt-20 flex flex-col justify-center items-center mx-auto max-w-sm md:max-w-6xl pb-1 min-h-[580px] md:min-h-[650px] rounded-lg shadow-xl">
              <div className="flex flex-col justify-center items-center max-w-lg rounded-lg">
                <video
                  src="/gamba.mp4"
                  className="w-full h-full"
                  autoPlay
                  muted
                  playsInline
                  loop
                />
                <p className="text-2xl text-white mt-5">Invalid game ID...</p>
              </div>
            </div>
          )}
        </>
      )}
      <div className="flex flex-col justify-center items-center mx-auto max-w-6xl max-sm:max-w-sm mb-4">
        <div className="py-4">
          <GameSlider />
        </div>
      </div>
    </>
  );
};

export default GamePage;
