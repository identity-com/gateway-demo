import './index.css';
import {initWalletUI} from './ui/wallet';
import {Transaction, Connection, clusterApiUrl, SystemProgram, Keypair, PublicKey} from '@solana/web3.js';
import bs58 from 'bs58';
import ui from './ui/';
import {findGatewayToken} from "@identity.com/solana-gateway-ts";
import {createTransferTransaction, tokenUrl} from "./util";

// TODO: Read from config
const gatekeeperNetwork = new PublicKey('tgnuXXNMDLK8dy7Xm1TdeGyc95MDym4bvAQCwcW21Bf');
let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
let connectedWallet;

/**
 * Triggers when the user connects a wallet
 */
const onWalletConnected = async (wallet) => {
  connectedWallet = wallet;

  console.log(`Connected wallet ${wallet.publicKey.toBase58()}`);

  ui.showTokenChecking();

  // Check if the user has a token and update the UI accordingly
  findGatewayToken(connection, wallet.publicKey, gatekeeperNetwork)
    .then(token => {
      if (token) {
        console.log('Found token', token);
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
const onWalletDisconnected = (wallet) => {
  connectedWallet = undefined;
  ui.showWallets();
}

/**
 * Sends the required transactions. If a serialized transaction is provided it will be included
 */
const sendTransactions = async (data) => {
  const transactions = [];

  // Sign locally if a serialized transaction is returned
  if (data && data.serialized) {
    const tokenTransaction = Transaction.from(bs58.decode(data.serialized));
    transactions.push(tokenTransaction);
  }

  const recipient = Keypair.generate().publicKey;
  const transferTransaction = await createTransferTransaction(
    connection,
    connectedWallet.publicKey,
    recipient,
    1);
  transactions.push(transferTransaction);

  const signedTransactions = await connectedWallet.signAllTransactions(transactions);

  const promises = signedTransactions.map(async (transaction) => {
    const signature = await connection.sendRawTransaction(transaction.serialize());
    return connection.confirmTransaction(signature);
  });

  await Promise.all(promises).then(() => {
    ui.showToken(true);
  });
}

/**
 * Makes a backend call to issue a token. If clientSigns is true, a partially signed transaction is returned
 */
const issueToken = (clientSigns = true) => {
  fetch(tokenUrl(connectedWallet.publicKey, clientSigns))
    .then(response => response.json())
    .then(response => {
      return response;
    })
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
