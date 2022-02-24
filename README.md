
# Gateway Demo Application

The Gateway demo application show a basic examples of:
* Checking for the existence of a Gateway token on the frontend
* Issuing a token from the server side (gatekeeper signs & pays)
* Issuing a token from the client side (signed and paid by the user's wallet)
* Executing a transfer of SOL through a program that checks for the existence of the gateway token

## Live Demo
A live demo can be accessed at [http://demo.identity.com/protected-transfer/](http://demo.identity.com/protected-transfer/).

## Run the demo locally
The following command will bundle the frontend and launch an express server serving both the static frontend
content and the backend web service.
```bash
yarn demo
```

## Configure the Demo
To configure the application to use a different gatekeeper, network or other settings.

### Frontend Configuration

The default frontend configuration can be found at `frontend/src/config/default.js`, and can be overridden based on 
the `STAGE` environment variable at `frontend/src/config/{STAGE}.js`

```javascript
module.exports = {
  // The base58 encoded public key for the gatekeeper network
  gatekeeperNetworkPublicKey58: 'tgnuXXNMDLK8dy7Xm1TdeGyc95MDym4bvAQCwcW21Bf',
  // The solana cluster to use
  solanaCluster: 'devnet',
  // The endpoint base url for the backend
  apiEndpointBaseUrl: 'https://gatekeeper-demo.identity.com',
}
```

### Backend Configuration

The default backend configuration can be found at `backend/src/config/default.js`, and can be overridden based on
the `STAGE` environment variable at `backend/src/config/{STAGE}.js`

```javascript
module.exports = {
  // The base58 encoded private key for the gatekeeper
  gatekeeperAuthoritySecretKey58: 'QzSdRKirjb3Dq64ZoWkxyNwmNVgefWNrAcUGwJF6pVx9ZeiXYCWWc4eBFBYwgP5qBnwmX3nA6PYQqLuqSuuuFsx',
  // The base58 encoded public key for the gatekeeper network
  gatekeeperNetworkPublicKey58: 'tgnuXXNMDLK8dy7Xm1TdeGyc95MDym4bvAQCwcW21Bf',
  // The solana cluster to use 
  solanaCluster: 'devnet',
  // The port to run the web server on
  serverPort: 3000,
  // Serve static content from the frontend from express (for local testing)
  serveStatic: false
}
```

## Development

### Frontend
```bash
yarn workspace @identity.com/gateway-demo-frontend watch
```
This will launch the frontend webpack build, and automatically re-run on changes to the frontend project.

### Backend
```bash
yarn workspace @identity.com/gateway-demo-backend watch
```
This will launch the backend express app, and automatically re-run on save. By default it will serve the content from
the frontend project at `frontend/dist` ;

### Program
The sample Solana program provided is developed using [Anchor](https://github.com/project-serum/anchor). You will need
the following:

1. [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools).
2. [Rust](https://www.rust-lang.org/tools/install)
3. [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html)


Build the program:
```bash
cd program
anchor build
```

If you wish to deploy the program on devnet, make sure to update the program ID. After a build, get the generated
address by executing:
```bash
solana -k program/target/deploy/gateway_demo-keypair.json address
```
or replace it with your own Solana key.

Update the program ID in [programs/gateway_demo/src/lib.rs](program/programs/gateway_demo/src/lib.rs) by replacing:
```rust
declare_id!("<your program id>");
```

Deploy the program:
```bash
anchor deploy --provider.cluster devnet
```
