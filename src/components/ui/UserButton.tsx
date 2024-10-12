// src/components/sections/UserButton.tsx

import { cleanUrlAndExtractReferral, fetchAndStoreReferral } from "@/referral";
import { useEffect, useState } from "react";
import { useGambaProvider, useWalletAddress } from "gamba-react-v2";

import { GambaUi } from "gamba-react-ui-v2";
import Link from "next/link";
import { Modal } from "./Modal";
import { PLATFORM_REFERRAL_FEE } from "@/constants";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function UserButton() {
  const walletModal = useWalletModal();
  const address = useWalletAddress();
  const [modal, setModal] = useState(false);
  const wallet = useWallet();
  const anchor = useGambaProvider();

  useEffect(() => {
    const initializeReferral = async () => {
      await fetchAndStoreReferral(anchor.anchorProvider, wallet.publicKey);
      cleanUrlAndExtractReferral();
    };

    initializeReferral();
  }, [anchor, wallet.publicKey]);

  const copyInvite = () => {
    if (!wallet.publicKey) {
      return walletModal.setVisible(true);
    }
    const referralLink = `${location.host}?code=${wallet.publicKey.toString()}`;
    navigator.clipboard.writeText(referralLink);
    toast.success(
      `Copied! Share your link to earn a ${
        PLATFORM_REFERRAL_FEE * 100
      }% fee when players use this platform`,
    );
  };

  const truncateString = (s: string, startLen = 4, endLen = startLen) =>
    s.slice(0, startLen) + "..." + s.slice(-endLen);

  const connect = () => {
    if (wallet.wallet) {
      wallet.connect();
    } else {
      walletModal.setVisible(true);
    }
  };

  const disconnect = () => {
    wallet.disconnect();
    setModal(false);
  };

  return (
    <>
      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div>
            <h1 className="min-w-64">
              {truncateString(address.toBase58(), 8, 8)}
            </h1>
            <p className="my-4 text-sm max-w-sm">
              Share your link to earn a {PLATFORM_REFERRAL_FEE * 100}% fee on each
              play when players use this platform using your code.
            </p>
            <button
              className="bg-[#8851ff] hover:bg-[#9564ff] rounded-lg p-2 text-xs transition-colors"
              onClick={copyInvite}
            >
              Share Referral Link
            </button>
            <div className="flex flex-row m-auto justify-end gap-2 pt-12">
              <div>
                <Link href="/profile" passHref>
                  <button
                    className="bg-[#8851ff] hover:bg-[#9564ff] rounded-lg p-2 text-xs  transition-colors"
                    onClick={() => setModal(false)}
                  >
                    View Profile
                  </button>
                </Link>
              </div>
              <div>
                <button
                  className="bg-red-500 hover:bg-red-600 rounded-lg p-2 text-xs transition-colors"
                  onClick={disconnect}
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {wallet.connected ? (
        <>
          <GambaUi.Button onClick={() => setModal(true)}>
            <div className="flex gap-2 items-center">
              <img src={wallet.wallet?.adapter.icon} width={20} />
              {truncateString(address.toBase58(), 3)}
            </div>
          </GambaUi.Button>
        </>
      ) : (
        <GambaUi.Button onClick={connect}>
          {wallet.connecting ? "Connecting" : "Connect"}
        </GambaUi.Button>
      )}
    </>
  );
}
