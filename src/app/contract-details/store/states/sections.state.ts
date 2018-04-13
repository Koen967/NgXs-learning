import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as ContractDetailsActions from '../actions/contract-details.actions';
import * as SectionsActions from '../actions/sections.actions';

import {
  ContractDetail,
  contractDetailsSchema,
  Section
} from '../../contract-details.model';
import { normalize } from 'normalizr';

import { ContractDetailsService } from '../../contract-details.service';

export class SectionsStateModel {
  sections: { [id: number]: Section };
  currentContractDetails: ContractDetail;
}

@State<SectionsStateModel>({
  name: 'sections',
  defaults: {
    sections: {},
    currentContractDetails: null
  }
})
export class SectionsState {
  //#region Selectors
  @Selector()
  static getSectionsArray(state: SectionsStateModel) {
    return Object.keys(state.sections).map(id => state.sections[id]);
  }

  @Selector()
  static getCurrentContractDetails(state: SectionsStateModel) {
    return state.currentContractDetails;
  }
  //#endregion Selectors

  //#region Reducer
  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    { setState }: StateContext<SectionsStateModel>,
    { contractDetails }: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(contractDetails, contractDetailsSchema);
    setState({
      sections: normalizedData.entities.sections,
      currentContractDetails: null
    });
  }

  @Action(SectionsActions.SetCurrentContractDetails)
  setCurrentContractDetails(
    { patchState }: StateContext<SectionsStateModel>,
    { contractDetails }: SectionsActions.SetCurrentContractDetails
  ) {
    patchState({
      currentContractDetails: contractDetails
    });
  }
  //#endregion Reducer
}
