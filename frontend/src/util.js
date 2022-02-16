import {SystemProgram, Transaction} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import idl from "./idl/gateway_demo.json";

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

/**
 * Generate the token URL to fetch the token/signature from the backend
 */
export const tokenUrl = (publicKey, clientSigns) => `/api/token/${publicKey.toBase58()}?clientSigns=${clientSigns}`;

/**
 * Calls the on-chain gateway demo program to validate the token and if valid, transfer lamports to the recipient
 */
export const getProgramTransferInstruction = async (connection, wallet, gatewayToken, recipient, lamports) => {
  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions())

  const program = new anchor.Program(idl, idl.metadata.address, provider);

  return program.instruction.transfer(new anchor.BN(lamports), {
    accounts: {
      gatewayToken,
      payer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      recipient
    },
  });
}
