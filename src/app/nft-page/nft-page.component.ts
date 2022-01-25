import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { from, Subject, switchMap, takeUntil } from 'rxjs';
import { selectUserNfts } from '../store-root/selectors/root.selectors';
import { Web3Service } from '../web3.service';

@Component({
  selector: 'app-nft-page',
  templateUrl: './nft-page.component.html',
  styleUrls: ['./nft-page.component.scss'],
})
export class NftPageComponent implements OnInit, OnDestroy {
  public userNfts: number[] = [];
  public mintedNfts: number[];
  public isLoading = false;
  public userPurchasedTicket = false;

  private destroy$ = new Subject<void>();

  constructor(private store: Store, private web3Service: Web3Service) {}

  public ngOnInit(): void {
    this.userNftsSub();
    this.getMintedNfts();
  }

  public getIsOwnedByUser(tokenId: number): boolean {
    return this.userNfts.includes(tokenId);
  }

  public buyToken(): void {
    this.isLoading = true;
    from(this.web3Service.web3Instance.eth.getAccounts())
      .pipe(
        switchMap((accounts: string[]) => {
          return from(
            this.web3Service.tokenContract.methods.buyTicket().send({
              from: accounts[0],
              value: this.web3Service.web3Instance.utils.toWei('0.05', 'ether'),
            })
          );
        })
      )
      .subscribe({
        next: (ticketId) => {
          this.isLoading = false;
          this.userPurchasedTicket = true;
          console.log(ticketId);
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        },
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMintedNfts(): void {
    from(
      this.web3Service.tokenContract.methods._tokenIdCounter().call()
    ).subscribe({
      next: (tokenCounter) => {
        this.mintedNfts = Array.from(
          Array(parseInt(tokenCounter as string) + 1).keys()
        );
      },
    });
  }

  private userNftsSub(): void {
    this.store
      .pipe(select(selectUserNfts), takeUntil(this.destroy$))
      .subscribe({
        next: (userNfts: number[]) => {
          this.userNfts = userNfts;
        },
      });
  }
}
