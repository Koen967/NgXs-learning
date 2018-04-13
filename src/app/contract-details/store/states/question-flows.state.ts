import {
  State,
  Action,
  StateContext,
  Selector,
  Store,
  Select
} from '@ngxs/store';
import * as ContractDetailsActions from '../actions/contract-details.actions';
import * as QuestionFlowsActions from '../actions/question-flows.actions';

import {
  ContractDetail,
  contractDetailsSchema,
  QuestionFlow,
  Section
} from '../../contract-details.model';
import { normalize } from 'normalizr';

import { ContractDetailsService } from '../../contract-details.service';
import { SectionsStateModel } from './sections.state';

export class QuestionFlowsStateModel {
  questionFlows: { [id: number]: QuestionFlow };
  currentSection: Section;
}

@State<QuestionFlowsStateModel>({
  name: 'questionFlows',
  defaults: {
    questionFlows: {},
    currentSection: null
  }
})
export class QuestionFlowsState {
  //#region Selectors
  @Selector()
  static getQuestionFlowsArray(state: QuestionFlowsStateModel) {
    return Object.keys(state.questionFlows).map(id => state.questionFlows[id]);
  }

  @Selector()
  static getQuestionFlowsArrayFromCurrentSection(
    state: QuestionFlowsStateModel
  ) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.currentSection.questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(state.questionFlows[+questionFlow]);
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getCurrentSection(state: QuestionFlowsStateModel) {
    return state.currentSection;
  }
  //#endregion Selector

  //#region Reducer
  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    { setState }: StateContext<QuestionFlowsStateModel>,
    { contractDetails }: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(contractDetails, contractDetailsSchema);
    setState({
      questionFlows: normalizedData.entities.questionFlows,
      currentSection: null
    });
  }

  @Action(QuestionFlowsActions.SetCurrentSection)
  SetCurrentSection(
    { patchState }: StateContext<QuestionFlowsStateModel>,
    { section }: QuestionFlowsActions.SetCurrentSection
  ) {
    patchState({
      currentSection: section
    });
  }
  //#endregion Reducer
}
