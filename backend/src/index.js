const express = require('express');
const {Keypair, PublicKey, Connection, clusterApiUrl} = require('@solana/web3.js');
const {GatekeeperService} = require('@identity.com/solana-gatekeeper-lib');
const bs58 = require('bs58');
const config = require('./config');

const app = express();
const port = config.serverPort || 3000;

const gatekeeperAuthority = Keypair.fromSecretKey(bs58.decode(config.gatekeeperAuthoritySecretKey58));
const gatekeeperNetwork = new PublicKey(config.gatekeeperNetworkPublicKey58);

app.get('/api/token/:key', async (request, response) => {
  const owner = new PublicKey(request.params.key);
  const connection = new Connection(clusterApiUrl(config.solanaCluster), 'confirmed');
  const clientSigns = request.query.clientSigns === 'true';

  const service = new GatekeeperService(
    connection,
    gatekeeperNetwork,
    gatekeeperAuthority,
  );

  let jsonResponse;
  if (clientSigns) { // (client signs) partially sign the transaction and return the serialized transaction
    let transaction = await service.issue(owner, {
      feePayer: owner,
      rentPayer: owner,
    });

    jsonResponse = {
      serialized: bs58.encode(transaction.transaction.serialize({requireAllSignatures: false}))
    }
  } else { // (server signs) sends the transaction and return the token information
    const token = await service.issue(owner).then(tx => tx.send()).then(tx => tx.confirm());

    jsonResponse = {
      token: token
    }
  }

  response.setHeader('Content-Type', 'application/json');
  response.json(jsonResponse);
});

app.use(express.static('../frontend/dist'))

app.listen(port, () => {
  console.log(`Started Gatekeeper Sample at http://localhost:${port}/`);
});




