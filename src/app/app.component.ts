import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, Subject, switchMap, take, takeUntil } from 'rxjs';
import { Web3Service } from './web3.service';
import { select, Store } from '@ngrx/store';
import {
  selectCurrentAddress,
  selectIsOwner,
  selectUserHasValidNft,
} from './store-root/selectors/root.selectors';
import { SetAddress, SetUserNft } from './store-root/actions/root.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public lotteries = ['0x6f0AD880a15EDcA81356f1F572A810dE8a59fF8f'];
  public lotteryPlayers = {};
  public currentAddress = '';
  public userNfts: number[] = [];
  public mintedNfts: number[] = [];
  public userHasValidNft = false;
  public isUserTheOwner = false;

  public successMessage: string = null;
  public errorMessage: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private web3Service: Web3Service, private store: Store) {}

  public ngOnInit(): void {
    this.addressSub();
    this.loadAccount();
    this.getUserNfts();
    this.hasUserValidTicketSub();
    this.isUserTheOwnerSub();
    this.checkTheUserOwner();
  }

  public connectToWallet(): void {
    from(this.web3Service.connectToMetamask())
      .pipe(
        switchMap(() => this.web3Service.web3Instance.eth.getAccounts()),
        take(1)
      )
      .subscribe({
        next: (accounts: string[]) => {
          this.currentAddress = accounts[0];
          console.log(accounts);
        },
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAccount(): void {
    from(this.web3Service.web3Instance.eth.getAccounts()).subscribe({
      next: (accounts: string[]) => {
        if (accounts.length) {
          this.currentAddress = accounts[0];
          this.store.dispatch(SetAddress({ address: accounts[0] }));
        }

        this.getUserNfts();
      },
    });
  }

  private getUserNfts(): void {
    if (!this.currentAddress.length) {
      return;
    }

    from(
      this.web3Service.tokenContract.methods
        .getUserTickets(this.currentAddress)
        .call()
    )
      .pipe(take(1))
      .subscribe({
        next: (userNfts) => {
          if (!(userNfts as string[]).length) {
            return;
          }

          userNfts = (userNfts as string[]).map((nftIndex: string) =>
            parseInt(nftIndex)
          );

          this.store.dispatch(SetUserNft({ nftIds: userNfts as number[] }));
          this.web3Service.checkUserHasValidTicket().subscribe();
        },
      });
  }

  private hasUserValidTicketSub(): void {
    this.store
      .pipe(select(selectUserHasValidNft), takeUntil(this.destroy$))
      .subscribe({
        next: (hasValidNft: boolean) => {
          this.userHasValidNft = hasValidNft;
        },
      });
  }

  private isUserTheOwnerSub(): void {
    this.store.pipe(select(selectIsOwner), takeUntil(this.destroy$)).subscribe({
      next: (isOwner: boolean) => {
        this.isUserTheOwner = isOwner;
      },
    });
  }

  private checkTheUserOwner(): void {
    this.web3Service.checkIsTheUserTheOwner().subscribe();
  }

  private addressSub(): void {
    this.store
      .pipe(select(selectCurrentAddress), takeUntil(this.destroy$))
      .subscribe({
        next: (address: string) => {
          this.currentAddress = address;
        },
      });
  }
}
