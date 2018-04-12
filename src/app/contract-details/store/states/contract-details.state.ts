import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  ContractDetail,
  contractDetailsSchema
} from '../../contract-details.model';
import * as ContractDetailsActions from '../actions/contract-details.actions';
import { normalize } from 'normalizr';
import { ContractDetailsService } from '../../contract-details.service';

export class ContractDetailsStateModel {
  contractDetails: { [id: string]: ContractDetail };
  loading: boolean;
  loaded: boolean;
}

@State<ContractDetailsStateModel>({
  name: 'contractDetails',
  defaults: {
    contractDetails: {},
    loading: false,
    loaded: false
  }
})
export class ContractDetailsState {
  constructor(private contractDetailsService: ContractDetailsService) {}

  @Action(ContractDetailsActions.GetContractDetails)
  getContractDetails({ patchState }: StateContext<ContractDetailsStateModel>) {
    patchState({
      loading: true
    });
  }

  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    { patchState }: StateContext<ContractDetailsStateModel>,
    { contractDetails }: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(contractDetails, contractDetailsSchema);
    patchState({
      contractDetails: normalizedData,
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
}
