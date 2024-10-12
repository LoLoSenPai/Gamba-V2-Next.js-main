// src/referral/program.ts
import { AnchorProvider, BorshAccountsCoder, Program } from "@coral-xyz/anchor";

import { PublicKey } from "@solana/web3.js";
import { REFERRAL_IDL } from "./idl";
import { updateReferralData } from ".";

export const PROGRAM_ID = new PublicKey(
  "RefwFk2PPNd9bPehSyAkrkrehSHkvz6mTAHTNe8v9vH",
);

export const referralAccountsCoder = new BorshAccountsCoder(REFERRAL_IDL);

const getPdaAddress = (...seeds: (Uint8Array | Buffer)[]) => {
  const [address] = PublicKey.findProgramAddressSync(seeds, PROGRAM_ID);
  return address;
};

export const getRefererPda = (creator: PublicKey, authority: PublicKey) =>
  getPdaAddress(creator.toBytes(), authority.toBytes());

export const createReferral = async (
  provider: AnchorProvider,
  creator: PublicKey,
  referAccount: PublicKey,
) => {
  const referralProgram = new Program(REFERRAL_IDL, PROGRAM_ID, provider);
  const instruction = await referralProgram.methods
    .configReferAccount(referAccount)
    .accounts({
      referAccount: getRefererPda(creator, provider.wallet.publicKey),
      creator,
    })
    .instruction();

  // Update referral data in cookies after successful creation
  updateReferralData(referAccount.toString(), true);

  return instruction;
};

export const closeReferral = async (
  provider: AnchorProvider,
  creator: PublicKey,
) => {
  const referralProgram = new Program(REFERRAL_IDL, PROGRAM_ID, provider);
  return referralProgram.methods
    .closeReferAccount()
    .accounts({
      referAccount: getRefererPda(creator, provider.wallet.publicKey),
      creator,
    })
    .instruction();
};

export const fetchReferral = async (
  provider: AnchorProvider,
  pda: PublicKey,
) => {
  const referralProgram = new Program(REFERRAL_IDL, PROGRAM_ID, provider);
  referralProgram.account.referAccount.all().then((x) => console.log("ALL", x));
  const account = await referralProgram.account.referAccount.fetch(pda);
  if (!account) return null;
  return account.referrer;
};
