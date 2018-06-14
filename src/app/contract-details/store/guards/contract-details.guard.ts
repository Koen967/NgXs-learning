import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as ContractDetailsActions from '../actions/contract-details.actions';
import { ContractDetailsState } from '../states';

@Injectable()
export class ContractDetailsGuard implements CanActivate {
  routerState: any;

  @Select(ContractDetailsState.getContractDetailsLoaded)
  loaded$: Observable<boolean>;

  constructor(private store: Store) {}

  getContractDetails() {
    return this.loaded$.pipe(
      tap((loaded: any) => {
        if (!loaded) {
          this.store.dispatch(
            new ContractDetailsActions.GetContractDetails(9292)
          );
        }
      }),
      filter((loaded: any) => {
        return loaded;
      }),
      take(1)
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.getContractDetails().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }
}
