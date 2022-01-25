import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { from, Observable, of, switchMap } from 'rxjs';
import { SetIsOwner } from './store-root/actions/root.actions';
import { Web3Service } from './web3.service';

@Injectable({
  providedIn: 'root',
})
export class OwnerGuard implements CanActivate {
  constructor(private web3Service: Web3Service, private store: Store) {}

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
    return this.web3Service.checkIsTheUserTheOwner();
  }
}
