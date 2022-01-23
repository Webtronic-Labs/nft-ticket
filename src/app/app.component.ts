import { Component, OnInit } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { Web3Service } from './web3.service';
import lotteryABI from '../crypto/compiled/lottery.abi';
import lotteryBytecode from '../crypto/compiled/lottery.bytecode';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public lotteries = ['0x6f0AD880a15EDcA81356f1F572A810dE8a59fF8f'];
  public lotteryPlayers = {};
  public currentAddress = null;

  public successMessage: string = null;
  public errorMessage: boolean = false;

  constructor(private web3Service: Web3Service) {}

  public ngOnInit(): void {
    this.getPlayers();
    this.getManagers();
    from(this.web3Service.web3Instance.eth.getAccounts()).subscribe(
      (accounts: string[]) => {
        this.currentAddress = accounts[0];
      }
    );
  }

  public getCanEnter(lotteryAddress: string): boolean {
    return (
      !this.lotteryPlayers[lotteryAddress]?.players?.includes(
        this.currentAddress
      ) ?? true
    );
  }

  public createLottery() {
    let currentAddress: string = null;
    this.successMessage = 'Started transaction';
    from(this.web3Service.web3Instance.eth.getAccounts())
      .pipe(
        switchMap((accounts: string[]) => {
          currentAddress = accounts[0];
          const lotteryContract =
            new this.web3Service.web3Instance.eth.Contract(
              JSON.parse(JSON.stringify(lotteryABI))
            );

          return from(
            lotteryContract
              .deploy({ data: lotteryBytecode.object })
              .send({ from: currentAddress + '' })
          );
        })
      )
      .subscribe({
        next: (address: any) => {
          this.successMessage =
            'Deployed lottery successful at ' + address.address;
          console.log(address.address);
        },
        error: (error) => {
          this.errorMessage = true;
          this.successMessage = null;
          console.error(error);
        },
      });
  }

  public getPlayers(lotteryAddress?: string) {
    let addresses: string[] = [];

    if (lotteryAddress) {
      addresses = [lotteryAddress];
    } else {
      addresses = this.lotteries;
    }
    console.log(this.web3Service.web3Instance);

    for (let address of addresses) {
      const lotteryContract = new this.web3Service.web3Instance.eth.Contract(
        JSON.parse(JSON.stringify(lotteryABI)),
        address
      );

      from(lotteryContract.methods.getPlayers().call()).subscribe({
        next: (players: any) => {
          if (!this.lotteryPlayers[address]) {
            this.lotteryPlayers[address] = { players: players };
          }

          this.lotteryPlayers[address].players = players;
        },
      });
    }
  }

  public participateInLottery(address: string) {
    let currentAddress: string = null;

    from(this.web3Service.web3Instance.eth.getAccounts())
      .pipe(
        switchMap((accounts: string[]) => {
          currentAddress = accounts[0];
          const lotteryContract =
            new this.web3Service.web3Instance.eth.Contract(
              JSON.parse(JSON.stringify(lotteryABI)),
              address
            );

          return from(
            lotteryContract.methods.enter().send({
              from: currentAddress,
              value: this.web3Service.web3Instance.utils.toWei('0.1', 'ether'),
            })
          );
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log(address);
          this.lotteryPlayers[response].players = [
            ...(this.lotteryPlayers[response].players ?? []),
            this.currentAddress,
          ];
          this.getPlayers(response);
        },
        error: (error) => {
          this.errorMessage = true;
          this.successMessage = null;
          console.error(error);
        },
      });
  }

  public pickWinner(lotteryAddress: string) {
    const lotteryContract = new this.web3Service.web3Instance.eth.Contract(
      JSON.parse(JSON.stringify(lotteryABI)),
      lotteryAddress
    );
    this.successMessage = 'Started transaction';

    from(
      lotteryContract.methods.pickWinner().send({ from: this.currentAddress })
    ).subscribe({
      next: () => {
        this.successMessage = 'Winner picked!';
        this.lotteryPlayers[lotteryAddress].players = [];
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = true;
      },
    });
  }

  private getManagers() {
    for (let address of this.lotteries) {
      const lotteryContract = new this.web3Service.web3Instance.eth.Contract(
        JSON.parse(JSON.stringify(lotteryABI)),
        address
      );

      from(lotteryContract.methods.manager().call()).subscribe({
        next: (manager: any) => {
          if (!this.lotteryPlayers[address]) {
            this.lotteryPlayers[address] = { manager: manager };

            return;
          }

          this.lotteryPlayers[address].manager = manager;
        },
      });
    }
  }
}
