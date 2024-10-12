// src/components/sections/Profile.tsx
import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import { GambaButton } from "@/components/ui/GambaPlayButton";
import { GambaUi } from "gamba-react-ui-v2";
import { PLATFORM_REFERRAL_FEE } from "@/constants";
import { PublicKey } from "@solana/web3.js";
import { cleanUrlAndExtractReferral } from "@/referral";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

interface ReferralData {
  current: string | null;
  history: string[];
}

const MAX_HISTORY = 5;

const Profile: React.FC = () => {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const [referralData, setReferralData] = useState<ReferralData>({
    current: null,
    history: [],
  });

  useEffect(() => {
    cleanUrlAndExtractReferral();
    loadReferralData();
  }, []);

  const loadReferralData = () => {
    const storedData = Cookies.get("referralData");
    if (storedData) {
      setReferralData(JSON.parse(storedData));
    }
  };

  const saveReferralData = (data: ReferralData) => {
    Cookies.set("referralData", JSON.stringify(data));
    setReferralData(data);
  };

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  const copyInvite = () => {
    if (!wallet.publicKey) {
      return walletModal.setVisible(true);
    }
    const referralLink = `${
      location.origin
    }?code=${wallet.publicKey.toString()}`;
    navigator.clipboard.writeText(referralLink);
    toast.success(
      `Copied! Share your link to earn a ${
        PLATFORM_REFERRAL_FEE * 100
      }% fee when players use this platform`,
    );
  };

  const truncateString = (s: string, startLen = 4, endLen = startLen) =>
    s.slice(0, startLen) + "..." + s.slice(-endLen);

  const setHistoricalCode = (code: string) => {
    const updatedHistory = [
      code,
      ...referralData.history.filter((c) => c !== code),
    ].slice(0, MAX_HISTORY);
    const newData: ReferralData = { current: code, history: updatedHistory };
    saveReferralData(newData);
    toast.success("referral code updated: " + code);
  };

  return (
    <div className="min-h-[75vh] flex flex-col gap-5 mt-24 pb-10 px-5 md:max-w-6xl mx-auto transition-all duration-250 ease-in-out">
      {wallet && wallet.connected ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Wallet Information
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <img
                src={wallet.wallet?.adapter.icon}
                width={20}
                alt="Wallet Icon"
              />
              <span className="text-lg break-all">
                {wallet.publicKey &&
                  truncateString(wallet.publicKey.toString(), 8, 8)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              Your Referral Link
            </h1>
            <p className="text-lg">
              Share your link to earn a {PLATFORM_REFERRAL_FEE * 100}% fee on
              each play when players use this platform.
            </p>
            <div className="break-all flex-wrap border border-gray-300 p-4 rounded-md">
              <p className="text-lg">{`${location.origin}?code=${
                wallet.publicKey?.toString() || ""
              }`}</p>
            </div>
            <GambaButton onClick={copyInvite} text="Copy Invite Link" />
          </div>

          {referralData.current && (
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold">
                Current Referral Code
              </h2>
              <div className="break-all flex-wrap border border-gray-300 p-4 rounded-md">
                <p className="text-lg">
                  <strong className="text-lg text-[#9564ff]">
                    &quot;{referralData.current}&quot;
                  </strong>{" "}
                  earns {PLATFORM_REFERRAL_FEE * 100}% fee on each play
                </p>
              </div>
            </div>
          )}

          {referralData.history.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold">
                Referral History
              </h2>
              {referralData.history.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-300 p-2 rounded-md"
                >
                  <span>{truncateString(code, 8, 8)}</span>
                  <GambaButton
                    onClick={() => setHistoricalCode(code)}
                    text={code === referralData.current ? "Current" : "Use"}
                    disabled={code === referralData.current}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-10 mt-10">
          <h2 className="text-2xl md:text-3xl font-bold">Connect Wallet</h2>
          <GambaUi.Button onClick={connect}>
            {wallet.connecting ? "Connecting" : "Connect"}
          </GambaUi.Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
