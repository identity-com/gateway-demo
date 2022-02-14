import './index.css';
import {initWalletUI} from './ui/wallet';

let connectedWallet;

const showError = (error) => {
  alert(error.message);
  console.error(error);
}

const issueToken = () => {
  components.issueTokenButton.disabled = 'disabled';

  fetch(`/api/token/${connectedWallet.publicKey.toBase58()}`)
    .then(response => response.json())
    .then(data => {
      components.issueTokenResult.textContent = JSON.stringify(data, null, 2);
    })
    .catch(showError);
}

const components = {
  walletsContainer: document.getElementById('wallets'),
  tokenContainer: document.getElementById('token'),
  issueTokenButton: document.getElementById('token-issue-btn'),
  issueTokenResult: document.getElementById('token-issue-result'),
  showWallets: () => {
    components.walletsContainer.className = '';
    components.tokenContainer.className = 'hidden';
  },
  showToken: () => {
    components.tokenContainer.className = '';
    components.walletsContainer.className = 'hidden';
  },
  init() {
    this.issueTokenButton.onclick = issueToken;
  }
};
components.init();


initWalletUI(
  document.getElementById('wallet-adapter-container'),
  (wallet) => {
    connectedWallet = wallet;
    components.showToken();
  },
  () => {
    components.showWallets();
  }
);

// Display the UI
document.body.className = '';
