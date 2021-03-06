const express = require('express');
const {Keypair, PublicKey, Connection, clusterApiUrl} = require('@solana/web3.js');
const {GatekeeperService} = require('@identity.com/solana-gatekeeper-lib');
const bs58 = require('bs58');
const cors = require('cors');

const loadConfig = () => {
  const defaultConfig = require('./config/default');
  let stageConfig = {};

  try {
    stageConfig = process.env.STAGE ? require(`./config/${process.env.STAGE}.js`) : {};
  } catch (e) {
    console.log(e);
    // ignore if no config is found
  }

  return {
    ...defaultConfig,
    ...stageConfig,
  }
}

const config = loadConfig();
console.log(config);
const app = express();
const port = config.serverPort || 3000;

const gatekeeperAuthority = Keypair.fromSecretKey(bs58.decode(config.gatekeeperAuthoritySecretKey58));
const gatekeeperNetwork = new PublicKey(config.gatekeeperNetworkPublicKey58);

app.use(cors());

app.get('/api/token/:key', async (request, response) => {
  response.setHeader('Content-Type', 'application/json');

  try {
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
      const token = await service.issue(owner) // create the transaction
        .then(tx => tx.send()) // send the transaction
        .then(tx => tx.confirm()); // confirm the transaction

      jsonResponse = {
        token: token
      }
    }

    response.json(jsonResponse);
  } catch (e) {
    response.status(500, e.message).json({
      error: e.message
    });
  }
});

if (config.serveStatic) {
  app.use(express.static('../frontend/dist'))
} else {
  app.get('/', (request, response) => {
    response.status(200).send('v0.0.6');
  });
}

app.listen(port, () => {
  console.log(`Started Gateway Demo at http://localhost:${port}/`);
});




