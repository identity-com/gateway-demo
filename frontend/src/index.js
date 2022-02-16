import './index.css';
import {initWalletUI} from './ui/wallet';
import {Transaction, Connection, clusterApiUrl, Keypair, PublicKey} from '@solana/web3.js';
import bs58 from 'bs58';
import ui from './ui/';
import {findGatewayToken, getGatewayTokenAddressForOwnerAndGatekeeperNetwork} from "@identity.com/solana-gateway-ts";
import {tokenUrl, getProgramTransferInstruction} from "./util";
import config from '../../config';

// The gatekeeper network
const GATEKEEPER_NETWORK = new PublicKey(config.gatekeeperNetworkPublicKey58);
const LAMPORTS_TO_TRANSFER = 1000000;
let connection = new Connection(clusterApiUrl(config.solanaCluster), 'confirmed');
let connectedWallet;
let connectedToken;

/**
 * Triggers when the user connects a wallet
 */
const onWalletConnected = async (wallet) => {
  connectedWallet = wallet;

  console.log(`Connected wallet ${wallet.publicKey.toBase58()}`);

  ui.showTokenChecking();

  // Check if the user has a token and update the UI accordingly
  findGatewayToken(connection, wallet.publicKey, GATEKEEPER_NETWORK)
    .then(token => {
      connectedToken = token;
      if (token) {
        console.log('Found token');
        console.log(JSON.stringify(token, null, 2));
        ui.showToken(true);
      } else {
        console.log('No token found');
        ui.showToken(false);
      }
    })
    .catch(ui.showError);
}

/**
 * Triggers when the user disconnects a wallet
 */
const onWalletDisconnected = () => {
  connectedWallet = undefined;
  ui.showWallets();
}

/**
 * Sends the required transactions. If a serialized transaction is provided it will be included
 */
const sendTransactions = async (data) => {
  const recipient = Keypair.generate().publicKey;
  const transactions = [];

  // Sign locally if a serialized transaction is returned
  if (data && data.serialized) {
    const tokenTransaction = Transaction.from(bs58.decode(data.serialized));
    transactions.push(tokenTransaction);
  }

  // Derive the gateway token address
  const tokenAddress = await getGatewayTokenAddressForOwnerAndGatekeeperNetwork(
    connectedWallet.publicKey,
    GATEKEEPER_NETWORK
  );

  console.log(`Create instruction to check gateway token ${tokenAddress} is valid for `
    + `${connectedWallet.publicKey.toBase58()}, then sending ${LAMPORTS_TO_TRANSFER} ` +
    +`lamports to ${recipient.toBase58()}`);

  const transferIx = await getProgramTransferInstruction(
    connection,
    connectedWallet,
    tokenAddress,
    recipient,
    LAMPORTS_TO_TRANSFER
  );

  const {blockhash: recentBlockhash} = await connection.getRecentBlockhash();
  const transferTransaction = new Transaction({recentBlockhash, feePayer: connectedWallet.publicKey}).add(transferIx);

  transactions.push(transferTransaction);

  const signedTransactions = await connectedWallet.signAllTransactions(transactions);

  for (const signedTransaction of signedTransactions) {
    const signature = await connection.sendRawTransaction(signedTransaction.serialize()).catch(e => {
      ui.showError(e);
      throw e;
    });
    await connection.confirmTransaction(signature);
  }

  alert(`Token verified and SOL transfered to ${recipient.toBase58()}`);

  ui.showToken(true);
}

/**
 * Makes a backend call to issue a token. If clientSigns is true, a partially signed transaction is returned
 */
const issueToken = (clientSigns = true) => {
  fetch(tokenUrl(connectedWallet.publicKey, clientSigns))
    .then(async (response) => {
      if (!response.ok) {
        const json = await response.json();

        if (json.error) {
          throw new Error(json.error);
        }
        throw new Error(response.statusText);
      }

      return response;
    })
    .then(response => response.json())
    .then(sendTransactions)
    .catch(ui.showError);
}

const issueTokenServer = () => issueToken(false);
const issueTokenClient = () => issueToken(true);
const sendTransfer = () => sendTransactions();

ui.init(issueTokenServer, issueTokenClient, sendTransfer);

initWalletUI(
  document.getElementById('wallet-adapter-container'),
  onWalletConnected,
  onWalletDisconnected
);
