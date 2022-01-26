import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { from, switchMap, take } from 'rxjs';
import { Web3Service } from '../../web3.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent implements OnInit {
  public sendTicketForm = new FormGroup({
    address: new FormControl(),
  });
  public approveTicketForm = new FormGroup({
    tokenId: new FormControl(),
  });
  public rejectTicketForm = new FormGroup({
    tokenId: new FormControl(),
  });

  public isLoading = false;

  public ticketWasSent = false;
  public ticketWasWrong = false;

  public ticketWasApproved = false;
  public ticketWasApprovedWrong = false;

  public ticketWasRejected = false;
  public ticketWasRejectedWrong = false;

  constructor(private web3Service: Web3Service) {}

  ngOnInit(): void {}

  public sendTicket(): void {
    const address = this.sendTicketForm.get('address').value;

    if (!address) {
      return;
    }

    this.isLoading = true;
    from(this.web3Service.web3Instance.eth.getAccounts())
      .pipe(
        switchMap((accounts: string[]) =>
          from(
            this.web3Service.tokenContract.methods
              .safeMint(address)
              .send({ from: accounts[0] })
          )
        ),
        take(1)
      )
      .subscribe({
        next: () => {
          this.ticketWasSent = true;
          this.isLoading = false;
          this.ticketWasWrong = false;
        },
        error: (e) => {
          this.ticketWasWrong = true;
          this.ticketWasSent = false;
          this.isLoading = false;
        },
      });
  }

  public approveTicket(): void {
    const tokenId = this.approveTicketForm.get('tokenId').value;

    if (!tokenId) {
      return;
    }

    this.isLoading = true;
    from(this.web3Service.web3Instance.eth.getAccounts())
      .pipe(
        switchMap((accounts: string[]) =>
          from(
            this.web3Service.tokenContract.methods
              .approveTicket(tokenId)
              .send({ from: accounts[0] })
          )
        ),
        take(1)
      )
      .subscribe({
        next: () => {
          this.ticketWasApproved = true;
          this.isLoading = false;
          this.ticketWasApprovedWrong = false;
        },
        error: (e) => {
          this.ticketWasApprovedWrong = true;
          this.ticketWasApproved = false;
          this.isLoading = false;
        },
      });
  }

  public rejectTicket(): void {
    const tokenId = this.rejectTicketForm.get('tokenId').value;

    if (!tokenId.length) {
      return;
    }

    this.isLoading = true;
    from(this.web3Service.web3Instance.eth.getAccounts())
      .pipe(
        switchMap((accounts: string[]) =>
          from(
            this.web3Service.tokenContract.methods
              .rejectTicket(tokenId)
              .send({ from: accounts[0] })
          )
        ),
        take(1)
      )
      .subscribe({
        next: () => {
          this.ticketWasRejected = true;
          this.isLoading = false;
          this.ticketWasRejectedWrong = false;
        },
        error: (e) => {
          this.ticketWasRejectedWrong = true;
          this.ticketWasRejected = false;
          this.isLoading = false;
        },
      });
  }
}
