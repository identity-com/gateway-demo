const express = require('express');
const {Keypair, PublicKey, Connection, clusterApiUrl, Transaction} = require('@solana/web3.js');
const {
  issueVanilla,
  getGatewayTokenAddressForOwnerAndGatekeeperNetwork,
  getGatekeeperAccountAddress,
  getGatewayToken
} = require('@identity.com/solana-gateway-ts');
const bs58 = require('bs58');
const config = require('./config');

const app = express();
const port = config.serverPort || 3000;

const gatekeeperAuthority = Keypair.fromSecretKey(bs58.decode(config.gatekeeperAuthoritySecretKey58));
const gatekeeperNetwork = new PublicKey(config.gatekeeperNetworkPublicKey58);

(async () => {

  const owner = new PublicKey('HNQZ9gHdVJTZmd5BqpMKyZUZnAFfLj8hooVajUSGd7bu');
  const connection = new Connection(clusterApiUrl(config.solanaCluster), 'confirmed');

  const gatewayTokenAddress = await getGatewayTokenAddressForOwnerAndGatekeeperNetwork(
    owner,
    gatekeeperNetwork
  );

  const gatekeeperAccount = await getGatekeeperAccountAddress(
    gatekeeperAuthority.publicKey,
    gatekeeperNetwork
  );

  let token = await getGatewayToken(connection, gatewayTokenAddress);

  if (!token) {
    const recentBlockhash = await connection
      .getRecentBlockhash()
      .then((result) => result.blockhash);

    const transaction = new Transaction({recentBlockhash, feePayer: gatekeeperNetwork}).add(
      issueVanilla(
        gatewayTokenAddress,
        gatekeeperNetwork,
        gatekeeperAccount,
        owner,
        gatekeeperAuthority.publicKey,
        gatekeeperNetwork,
      )
    );
    transaction.partialSign(gatekeeperAuthority);
    const signature = await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction(signature);

    token = await getGatewayToken(connection, gatewayTokenAddress);
  }

})();
