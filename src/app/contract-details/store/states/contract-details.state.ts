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
    { patchState, dispatch }: StateContext<ContractDetailsStateModel>,
    { id }: ContractDetailsActions.GetContractDetails
  ) {
    patchState({
      loading: true
    });

    return this.contractDetailsService
      .getContractDetailsFromId(id)
      .pipe(
        map(contractDetails =>
          dispatch(
            new ContractDetailsActions.GetContractDetailsSuccess(
              contractDetails
            )
          )
        ),
        catchError(error =>
          dispatch(new ContractDetailsActions.GetContractDetailsFailed(error))
        )
      );
  }

  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    { setState }: StateContext<ContractDetailsStateModel>,
    { contractDetails }: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(contractDetails, contractDetailsSchema);
    setState({
      contractDetails: normalizedData.entities.contractDetails,
      loading: false,
      loaded: true
    });
  }

  @Action(ContractDetailsActions.GetContractDetailsFailed)
  getContractDetailsFailed({
    patchState
  }: StateContext<ContractDetailsStateModel>) {
    patchState({
      loading: false
    });
  }
  //#endregion Reducer
}
