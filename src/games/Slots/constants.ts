// src/games/Slots/constants.ts
export const SOUND_LOSE = "/games/slots/lose.mp3";
export const SOUND_PLAY = "/games/slots/insert.mp3";
export const SOUND_REVEAL_LEGENDARY = "/games/slots/reveal-legendary.mp3";
export const SOUND_REVEAL = "/games/slots/reveal.mp3";
export const SOUND_SPIN = "/games/slots/spin.mp3";
export const SOUND_WIN = "/games/slots/win.mp3";
export const IMAGE_2X = "/games/slots/2x.png";
export const IMAGE_3X = "/games/slots/3x.png";
export const IMAGE_5X = "/games/slots/5x.png";
export const IMAGE_COOL = "/games/slots/emoji-cool.png";
export const IMAGE_HEARTS = "/games/slots/emoji-hearts.png";
export const IMAGE_UNICORN = "/games/slots/unicorn.png";
export const IMAGE_WOJAK = "/games/slots/wojak.png";

export interface SlotItem {
  multiplier: number;
  image: string;
}

const slotItem = (multiplier: number, ...icons: string[]): SlotItem[] =>
  icons.map((image) => ({ multiplier, image }));

export const SLOT_ITEMS = [
  slotItem(7, IMAGE_UNICORN),
  slotItem(5, IMAGE_5X),
  slotItem(3, IMAGE_3X),
  slotItem(2, IMAGE_2X),
  slotItem(1, IMAGE_COOL, IMAGE_HEARTS),
  slotItem(0.5, IMAGE_WOJAK),
].flat();

export const NUM_SLOTS = 3;
// MS that it takes for spin to finish and reveal to start
export const SPIN_DELAY = 1000;
// MS between each slot reveal
export const REVEAL_SLOT_DELAY = 500;
// MS after reveal until win / lose effect is played
export const FINAL_DELAY = 500;
//
export const LEGENDARY_THRESHOLD = 5;
