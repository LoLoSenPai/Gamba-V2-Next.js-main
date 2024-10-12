// src/referral/plugin.ts
import "@solana/wallet-adapter-react-ui/styles.css";

import * as SplToken from "@solana/spl-token";

import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";

import Cookies from "js-cookie";
import { GambaPlugin } from "gamba-react-v2";
import { PLATFORM_REFERRAL_FEE } from "../constants";
import { createReferral } from "./program";
import { getReferralData } from "./index";

const getRecipientFromStorage = () => {
  try {
    const referralData = getReferralData();
    const referralAddressOnChain = Cookies.get("referralAddressOnChain");
    const referralAddress = referralAddressOnChain ?? referralData.current;
    console.log(referralAddressOnChain, referralData.current);
    if (!referralAddress) return null;
    return {
      recipient: new PublicKey(referralAddress),
      onChain: !!referralAddressOnChain,
    };
  } catch {
    return null;
  }
};

export const makeReferralPlugin =
  (feePercent = PLATFORM_REFERRAL_FEE): GambaPlugin =>
  async (input, context) => {
    const referral = getRecipientFromStorage();
    if (!referral) return [];

    const instructions: TransactionInstruction[] = [];
    const tokenAmount = BigInt(Math.floor(input.wager * feePercent));

    const { recipient, onChain } = referral;

    if (!onChain) {
      instructions.push(
        await createReferral(
          context.provider.anchorProvider!,
          input.creator,
          recipient,
        ),
      );
    }

    if (input.token.equals(SplToken.NATIVE_MINT)) {
      instructions.push(
        SystemProgram.transfer({
          fromPubkey: input.wallet,
          toPubkey: recipient,
          lamports: tokenAmount,
        }),
      );
    } else {
      const fromAta = SplToken.getAssociatedTokenAddressSync(
        input.token,
        input.wallet,
      );
      const toAta = SplToken.getAssociatedTokenAddressSync(
        input.token,
        recipient,
      );

      const recipientHasAta = await (async () => {
        try {
          await SplToken.getAccount(
            context.provider.anchorProvider.connection,
            toAta,
            "confirmed",
          );
          return true;
        } catch (error) {
          if (
            error instanceof SplToken.TokenAccountNotFoundError ||
            error instanceof SplToken.TokenInvalidAccountOwnerError
          ) {
            return false;
          } else {
            throw error;
          }
        }
      })();

      if (!recipientHasAta) {
        instructions.push(
          SplToken.createAssociatedTokenAccountInstruction(
            input.wallet,
            toAta,
            recipient,
            input.token,
          ),
        );
      }

      instructions.push(
        SplToken.createTransferInstruction(
          fromAta,
          toAta,
          input.wallet,
          tokenAmount,
        ),
      );
    }

    context.creatorFee = Math.max(0, context.creatorFee - feePercent);

    return instructions;
  };
