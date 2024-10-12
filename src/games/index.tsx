// src/games/index.tsx

import { GameBundle } from "gamba-react-ui-v2";
import dynamic from "next/dynamic";

interface GameMeta {
  background?: string;
  name: string;
  image?: string;
  description?: string;
  volatility?: number;
}

export const GAMES: GameBundle<GameMeta>[] = [
  {
    id: "dice",
    meta: {
      background: "#E91E63",
      name: "Dice",
      image: "/games/logo.png",
      description: `Dice offers an exhilarating challenge where players must forecast the outcome of a roll with a unique twist. By selecting a number, participants aim to roll below it to clinch victory. The dynamic nature of the game allows for adjustments in choices, directly influencing potential payouts and skillfully balancing risk and reward, ensuring an immersive and stimulating gaming experience.`,
      volatility: 2,
    },
    app: dynamic(() => import("./Dice")),
  },
  {
    id: "slots",
    meta: {
      background: "#2196F3",
      name: "Slots",
      image: "/games/logo.png",
      description: `Slots stands as the epitome of chance and anticipation, offering players a captivating journey through its reels. Engage in the timeless thrill of spinning symbols to align and unlock potential rewards, prominently displayed upfront. With its meticulously crafted interface, Slots delivers a fair and riveting casino experience, meticulously tailored for digital enthusiasts, promising moments of pure excitement and suspense.`,
      volatility: 3,
    },
    app: dynamic(() => import("./Slots")),
  },
  {
    id: "flip",
    meta: {
      background: "#FFEB3B",
      name: "Flip",
      image: "/games/logo.png",
      description: `Flip presents a compelling blend of simplicity and high-stakes excitement, where players face the tantalizing gamble of choosing between Heads or Tails. Every flip of the coin serves as a decisive moment, offering the potential to double one's fortune or lose it all. This straightforward yet adrenaline-inducing game tests players' luck and strategic decision-making prowess, ensuring an electrifying and immersive gaming session.`,
      volatility: 1,
    },
    app: dynamic(() => import("./Flip")),
  },
  {
    id: "hilo",
    meta: {
      background: "#F44336",
      name: "HiLo",
      image: "/games/logo.png",
      description: `HiLo invites players into a world of foresight and chance, where every decision holds the power to unlock untold riches. Embark on a journey of prediction as you forecast whether the next card will ascend or descend in value. Master the art of consecutive correct guesses to amplify winnings, strategically deciding when to cash out for maximum rewards, making each session an exhilarating test of skill and intuition.`,
      volatility: 2,
    },
    props: { logo: "/logo.svg" },
    app: dynamic(() => import("./HiLo")),
  },
  {
    id: "mines",
    meta: {
      background: "#9C27B0",
      name: "Mines",
      image: "/games/logo.png",
      description: `Mines emerges as a strategic masterpiece, where players navigate a perilous landscape in search of hidden treasures. Uncover squares with caution, as lurking mines threaten to abruptly end your quest. With each revelation, the stakes escalate, offering daring players a heart-pounding experience filled with suspense and calculated risk, ensuring an immersive and unforgettable gaming adventure.`,
      volatility: 2,
    },
    app: dynamic(() => import("./Mines")),
  },
  {
    id: "roulette",
    meta: {
      background: "#4CAF50",
      name: "Roulette",
      image: "/games/logo.png",
      description: `Roulette breathes new life into the timeless tradition of wheel-spinning, blending elegance with digital innovation. Place your bets and witness the mesmerizing spectacle of the wheel as it determines your fate. With its straightforward yet captivating gameplay and the allure of substantial wins, Roulette stands as a testament to the thrill of chance and fortune, promising endless excitement and anticipation.`,
      volatility: 3,
    },
    app: dynamic(() => import("./Roulette")),
  },
  {
    id: "plinko",
    meta: {
      background: "#00BCD4",
      name: "Plinko",
      image: "/games/logo.png",
      description: `Plinko transforms the act of dropping chips into an art form, where anticipation and strategy converge to create an endlessly entertaining spectacle. Witness the tension mount with each chip's descent down the pegged board, as they randomly find their place among slots boasting varying win amounts. Each drop offers a delicate balance between luck and skill, making Plinko a captivating odyssey of chance and strategy. ⚠️ Under development. Results shown might be incorrect. ⚠️`,
      volatility: 3,
    },
    app: dynamic(() => import("./Plinko")),
  },
  {
    id: "crash",
    meta: {
      background: "#FF9800",
      name: "Crash",
      image: "/games/logo.png",
      description: `Predict a multiplier target and watch a rocket attempt to reach it. If the rocket crashes before the target, the player loses; if it reaches or exceeds the target, the player wins.`,
      volatility: 5,
    },
    app: dynamic(() => import("./Crash")),
  },
  {
    id: "limbo",
    meta: {
      background: "#FFC107",
      name: "Limbo",
      image: "/games/logo.png",
      description: `Limbo challenges players to walk the fine line between ambition and caution, where every decision shapes their destiny. Set a target multiplier and place your bet, daring to defy the odds. As the stakes rise, so does the adrenaline, pushing players to test their strategy and intuition in pursuit of monumental victories, ensuring an immersive and adrenaline-fueled gaming experience.`,
      volatility: 5,
    },
    app: dynamic(() => import("./Limbo")),
  },
  {
    id: "keno",
    meta: {
      background: "#673AB7",
      name: "Keno",
      image: "/games/logo.png",
      description: `Keno beckons players into a world of strategic decision-making and anticipation, where every choice holds the potential for untold riches. Select up to 10 blocks and place your bets, eagerly awaiting the draw that will determine your fate. Whether opting for fewer numbers and the allure of substantial wins or more numbers for increased odds of success, Keno promises a riveting experience filled with excitement and possibility.`,
      volatility: 4,
    },
    app: dynamic(() => import("./Keno")),
  },
];
