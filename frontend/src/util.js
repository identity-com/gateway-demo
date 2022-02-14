import {SystemProgram, Transaction} from "@solana/web3.js";

/**
 * Creates a transfer transaction
 */
export const createTransferTransaction = async (
  connection,
  sender,
  recipient,
  lamportsToTransfer
) => {
  const {blockhash: recentBlockhash} = await connection.getRecentBlockhash();
  return new Transaction({recentBlockhash, feePayer: sender}).add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: recipient,
      lamports: lamportsToTransfer,
    })
  );
};

export const tokenUrl = (publicKey, clientSigns) => `/api/token/${publicKey.toBase58()}?clientSigns=${clientSigns}`;
