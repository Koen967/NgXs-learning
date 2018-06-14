import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as ContractDetailsActions from '../actions/contract-details.actions';

import {
  ContractDetail,
  contractDetailsSchema
} from '../../contract-details.model';
import { normalize } from 'normalizr';

import { ContractDetailsService } from '../../contract-details.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { SectionsState } from './sections.state';

export class ContractDetailsStateModel {
  contractDetails: { [id: number]: ContractDetail };
  loading: boolean;
  loaded: boolean;
}

@State<ContractDetailsStateModel>({
  name: 'contractDetails',
  defaults: {
    contractDetails: {},
    loading: false,
    loaded: false
  },
  children: [SectionsState]
})
export class ContractDetailsState {
  constructor(private contractDetailsService: ContractDetailsService) {}

  //#region Selectors
  @Selector()
  static getContractDetailsLoaded(state: ContractDetailsStateModel) {
    return state.loaded;
  }
  //#endregion Selectors

  //#region Reducer
  @Action(ContractDetailsActions.GetContractDetails)
  getContractDetails(
    ctx: StateContext<ContractDetailsStateModel>,
    action: ContractDetailsActions.GetContractDetails
  ) {
    ctx.patchState({
      loading: true
    });

    return this.contractDetailsService.getContractDetailsFromId(action.id).pipe(
      map(contractDetails =>
        ctx.dispatch(
          new ContractDetailsActions.GetContractDetailsSuccess(contractDetails)
        )
      ),
      catchError(error =>
        ctx.dispatch(new ContractDetailsActions.GetContractDetailsFailed(error))
      )
    );
  }

  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    ctx: StateContext<ContractDetailsStateModel>,
    action: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(
      action.contractDetails,
      contractDetailsSchema
    );
    ctx.setState({
      contractDetails: normalizedData.entities.contractDetails,
      loading: false,
      loaded: true
    });
  }

  @Action(ContractDetailsActions.GetContractDetailsFailed)
  getContractDetailsFailed(ctx: StateContext<ContractDetailsStateModel>) {
    ctx.patchState({
      loading: false
    });
  }
  //#endregion Reducer
}
