import {getPhantomWallet, getSolletWallet} from "@identity.com/wallet-adapter-wallets";

// The wallets to use
const WALLETS = [
  getPhantomWallet(),
  getSolletWallet(),
]

/**
 * Creates the buttons for the wallet adapter
 */
const createButton = (wallet, fnConnected, fnDisconnected) => {
  const button = document.createElement('button');
  button.className = 'wallet-adapter-button';

  const image = document.createElement('img');
  image.src = wallet.icon;
  const name = document.createElement('span')
  name.innerText = wallet.name;

  button.append(image);
  button.append(name);

  button.onclick = async () => {
    const walletAdapter = wallet.adapter();

    walletAdapter.on('connect', () => {
      fnConnected(walletAdapter);
    })

    walletAdapter.on('disconnect', () => {
      fnDisconnected(walletAdapter)
    })

    await walletAdapter.connect();
  }

  return button;
}

export const initWalletUI = (container, fnConnected, fnDisconnected) => {
  WALLETS.forEach((wallet) => {
    const button = createButton(wallet, fnConnected, fnDisconnected);

    container.append(button);
  });
}
