// src/referral/index.ts
import { fetchReferral, getRefererPda } from "./program";

import Cookies from "js-cookie";
import { PublicKey } from "@solana/web3.js";

const PLATFORM_CREATOR_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_PLATFORM_CREATOR as string,
);

interface ReferralData {
  current: string | null;
  history: string[];
}

const MAX_HISTORY = 5;

export const extractReferralAddress = (): PublicKey | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get("code");
  if (!referralCode) return null;

  try {
    const publicKey = new PublicKey(referralCode);
    updateReferralData(referralCode);
    cleanUrlParams(urlParams);
    return publicKey;
  } catch (err) {
    console.error("Invalid referral address:", err);
    return null;
  }
};

export const fetchAndStoreReferral = async (
  anchorProvider: any,
  walletPublicKey: PublicKey | null,
) => {
  try {
    const pda = getRefererPda(
      PLATFORM_CREATOR_ADDRESS,
      walletPublicKey ?? PublicKey.default,
    );
    const referer = await fetchReferral(anchorProvider, pda);
    if (referer) {
      updateReferralData(referer.toString(), true);
    }
  } catch (err) {
    console.error("Referral", err);
  }
};

export const cleanUrlAndExtractReferral = () => {
  try {
    const address = extractReferralAddress();
    if (address) {
      updateReferralData(address.toString());
    }
  } catch (err) {
    console.error("Error extracting or cleaning referral address:", err);
  }
};

const cleanUrlParams = (urlParams: URLSearchParams) => {
  urlParams.delete("code");
  const newUrl = `${window.location.pathname}${
    urlParams.toString() ? "?" + urlParams.toString() : ""
  }${window.location.hash}`;
  window.history.replaceState({}, "", newUrl);
};

export const updateReferralData = (
  referralCode: string,
  onChain: boolean = false,
) => {
  const referralData: ReferralData = JSON.parse(
    Cookies.get("referralData") || '{"current":null,"history":[]}',
  );
  referralData.current = referralCode;
  referralData.history = [
    referralCode,
    ...referralData.history.filter((code) => code !== referralCode),
  ].slice(0, MAX_HISTORY);
  Cookies.set("referralData", JSON.stringify(referralData));
  if (onChain) {
    Cookies.set("referralAddressOnChain", referralCode);
  }
};

export const getReferralData = (): ReferralData => {
  return JSON.parse(
    Cookies.get("referralData") || '{"current":null,"history":[]}',
  );
};
