const {PublicKey} = require("@solana/web3.js");
module.exports = {
  walletsContainer: null,
  tokenContainer: null,
  tokenCheckingContainer: null,
  issueTokenServerButton: null,
  issueTokenClientButton: null,
  recipientAddress: null,
  recipientLamports: null,
  showWallets: () => {
    this.walletsContainer.className = null;
    this.tokenContainer.className = 'hidden';
    this.tokenCheckingContainer.className = 'hidden';
  },
  showTokenChecking: () => {
    this.tokenContainer.className = 'hidden';
    this.walletsContainer.className = 'hidden';
    this.tokenCheckingContainer.className = null;
  },
  showToken: (hasToken) => {
    if (hasToken) {
      this.issueTokenServerButton.className = 'hidden';
      this.issueTokenClientButton.className = 'hidden';
      this.transferButton.className = null;
    } else {
      this.issueTokenServerButton.className = null;
      this.issueTokenClientButton.className = null;
      this.transferButton.className = 'hidden';
    }

    this.tokenContainer.className = null;
    this.walletsContainer.className = 'hidden';
    this.tokenCheckingContainer.className = 'hidden';
  },
  recipient: () => {
    let recipient;
    const sol = parseFloat(this.recipientLamports.value);

    try {
      recipient = new PublicKey(this.recipientAddress.value);
    } catch (e) {
      alert('Invalid recipient address');

      throw e;
    }

    if (!sol || sol <= 0) {
      alert('Invalid SOL amount');
      throw new Error('Invalid SOL amount');
    }

    return {
      recipient,
      sol
    }
  },
  showError: (error) => {
    alert(error.message);
    console.error(error);
  },
  init: (issueServerSide, issueClientSide, transfer) => {
    this.walletsContainer = document.getElementById('wallets');
    this.tokenContainer = document.getElementById('token');
    this.tokenCheckingContainer = document.getElementById('token-checking');

    this.issueTokenServerButton = document.getElementById('token-issue-server-btn');
    this.issueTokenClientButton = document.getElementById('token-issue-client-btn');
    this.transferButton = document.getElementById('transfer-btn');

    this.recipientAddress = document.getElementById('recipient-address');
    this.recipientLamports = document.getElementById('recipient-lamports');

    this.issueTokenServerButton.onclick = issueServerSide;
    this.issueTokenClientButton.onclick = issueClientSide;
    this.transferButton.onclick = transfer;
  }
}
