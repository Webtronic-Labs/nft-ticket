import { Injectable } from '@angular/core';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

@Injectable({ providedIn: 'root' })
export class Web3Service {
  public web3Instance: Web3 = null;

  constructor() {
    this.initWeb3();
  }

  private async initWeb3() {
    const web3ProviderURI =
      'https://rinkeby.infura.io/v3/00b89145b77d46358b0aa00bdd30bc32';

    if (window.ethereum) {
      // window.ethereum.request({ method: 'eth_requestAccounts' });
      this.web3Instance = new Web3(window.web3.currentProvider);
    } else {
      const web3Provider = new Web3.providers.HttpProvider(web3ProviderURI);
      this.web3Instance = new Web3(web3Provider);
    }
  }
}
