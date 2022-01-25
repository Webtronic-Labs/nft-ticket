import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { from, take } from 'rxjs';
import { Web3Service } from '../web3.service';

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.scss'],
})
export class NftComponent implements OnInit {
  @Input()
  public id = null;
  @Input()
  public isOwnedByUser = false;
  @Output()
  public buyToken = new EventEmitter();

  public isOwned = false;
  public isLoading = false;

  constructor(private web3service: Web3Service) {}

  public ngOnInit(): void {
    this.checkIsSold();
  }

  private checkIsSold(): void {
    this.isLoading = true;

    from(this.web3service.tokenContract.methods.ownerOf(this.id).call())
      .pipe(take(1))
      .subscribe({
        next: (address) => {
          this.isLoading = false;
          if (
            address &&
            address !== '0x0000000000000000000000000000000000000000'
          ) {
            this.isOwned = true;

            return;
          }

          this.isOwned = false;
        },
        error: () => {
          this.isLoading = false;
          this.isOwned = false;
        },
      });
  }
}
