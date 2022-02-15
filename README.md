
# Gateway Demo Application

The Gateway demo application show a basic examples of:
* Checking for the existence of a Gateway token
* Issuing a token from the server side (gatekeeper signs & pays)
* Issuing a token from the client side (signed and paid by the user's wallet)

## Run the demo
The following command will bundle the frontend and launch and express server serving both the static frontend
content and the backend web service.
```bash
yarn demo
```
## Configure the demo
To configure the application to use a different gatekeeper, network or other settings, update the `config.js`
in the root of the project:
```javascript
module.exports = {
  // The base58 encoded private key for the gatekeeper (used in the backend)
  gatekeeperAuthoritySecretKey58: 'QzSdRKirjb3Dq64ZoWkxyNwmNVgefWNrAcUGwJF6pVx9ZeiXYCWWc4eBFBYwgP5qBnwmX3nA6PYQqLuqSuuuFsx',
  // The base58 encoded public key for the gatekeeper network (used in the frontend and backend)
  gatekeeperNetworkPublicKey58: 'tgnuXXNMDLK8dy7Xm1TdeGyc95MDym4bvAQCwcW21Bf',
  // The solana cluster to use (used in the frontend and backend)
  solanaCluster: 'devnet',
  // The port to run the web server on
  serverPort: 3000
}
```
