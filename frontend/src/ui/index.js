module.exports = {
  walletsContainer: null,
  tokenContainer: null,
  tokenCheckingContainer: null,
  issueTokenServerButton: null,
  issueTokenClientButton: null,
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

    this.issueTokenServerButton.onclick = issueServerSide;
    this.issueTokenClientButton.onclick = issueClientSide;
    this.transferButton.onclick = transfer;
  }
}
