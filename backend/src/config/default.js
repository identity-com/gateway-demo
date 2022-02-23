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
