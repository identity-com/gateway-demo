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

  const service = new GatekeeperService(
    connection,
    gatekeeperNetwork,
    gatekeeperAuthority,
  );

  // Check if a token exists, else issue one
  let token = await service.findGatewayTokenForOwner(owner);
  if (token === null) {
    token = await service.issue(owner).then(tx => tx.send()).then(tx => tx.confirm());
  }

  response.setHeader('Content-Type', 'application/json');
  response.json(token);
});

app.use(express.static('../frontend/dist'))

app.listen(port, () => {
  console.log(`Started Gatekeeper Sample at http://localhost:${port}/`);
});




