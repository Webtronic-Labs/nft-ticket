import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import Contract from 'web3';
import Web3 from 'web3';
import { TicketABI } from '../../contracts/ticket-token.abi';
import {
  SetAddress,
  SetIsOwner,
  SetUseHasValidTicket,
} from './store-root/actions/root.actions';
import { selectUserNfts } from './store-root/selectors/root.selectors';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

@Injectable({ providedIn: 'root' })
export class Web3Service {
  public web3Instance: Web3 = null;
  public tokenContract = null;

  private tokenAddress = '0x2306670340C3762147ccE8cDf2a00999c0c0AD7A';

  constructor(private store: Store, private router: Router) {
    this.initWeb3();
  }

  public async connectToMetamask() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
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

    this.tokenContract = new this.web3Instance.eth.Contract(
      JSON.parse(JSON.stringify(TicketABI)),
      this.tokenAddress
    );
  }

  public checkIsTheUserTheOwner(): Observable<boolean> {
    let currentAccount = '';

    return from(this.web3Instance.eth.getAccounts()).pipe(
      switchMap((accounts: string[]) => {
        currentAccount = accounts[0];
        this.store.dispatch(SetAddress({ address: currentAccount }));

        return from(this.tokenContract.methods.owner().call());
      }),
      switchMap((ownerAddress) => {
        const isCurrentUserTheOwner =
          currentAccount?.toString() === ownerAddress.toString();
        this.store.dispatch(SetIsOwner({ isOwner: isCurrentUserTheOwner }));

        return of(isCurrentUserTheOwner);
      })
    );
  }

  public checkUserHasValidTicket(): Observable<boolean> {
    return this.store.pipe(
      select(selectUserNfts),
      switchMap((userIds: number[]) => {
        const nftCheck: Observable<boolean>[] = [];
        userIds.forEach((nftId: number) => {
          nftCheck.push(
            (
              from(
                this.tokenContract.methods.getAcceptedTicket(nftId).call()
              ) as Observable<boolean>
            ).pipe(
              catchError((e) => {
                return of(false);
              })
            )
          );
        });

        return forkJoin(nftCheck);
      }),
      switchMap((results: boolean[]) => {
        const hasUserValidNft: boolean = !!results.find(
          (result: boolean) => result === true
        );
        this.store.dispatch(
          SetUseHasValidTicket({ hasValidTicket: hasUserValidNft })
        );

        if (!hasUserValidNft) {
          this.router.navigate(['/nft']);
        }

        return of(hasUserValidNft);
      }),
      take(1)
    );
  }
}
