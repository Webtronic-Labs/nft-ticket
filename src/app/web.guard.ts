import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { forkJoin, Observable, of, switchMap, take, tap } from 'rxjs';
import { SetUseHasValidTicket } from './store-root/actions/root.actions';
import { selectUserNfts } from './store-root/selectors/root.selectors';
import { Web3Service } from './web3.service';

@Injectable({
  providedIn: 'root',
})
export class WebGuard implements CanActivate {
  constructor(private web3Service: Web3Service) {}

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canEnterTheRoute(state.url, next);
  }

  public canActivateChild(
    next: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canEnterTheRoute('', next);
  }

  public canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.canEnterTheRoute('');
  }

  private canEnterTheRoute(
    returnUrl: string,
    route: ActivatedRouteSnapshot = null
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.web3Service.checkUserHasValidTicket();
  }
}
