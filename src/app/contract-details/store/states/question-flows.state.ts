import {
  State,
  Action,
  StateContext,
  Selector,
  Store,
  Select
} from '@ngxs/store';
import * as ContractDetailsActions from '../actions/contract-details.actions';
import * as SectionsActions from '../actions/sections.actions';
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
import { patch } from 'webdriver-js-extender';

export class QuestionFlowsStateModel {
  questionFlows: { [id: number]: QuestionFlow };
  currentQuestionFlow: QuestionFlow;
  currentSectionQuestionFlows: number[];
}

@State<QuestionFlowsStateModel>({
  name: 'questionFlows',
  defaults: {
    questionFlows: {},
    currentQuestionFlow: null,
    currentSectionQuestionFlows: []
  }
})
export class QuestionFlowsState {
  //#region Selectors
  @Selector()
  static getQuestionFlowsArray(state: QuestionFlowsStateModel) {
    return Object.keys(state.questionFlows).map(id => state.questionFlows[id]);
  }

  @Selector()
  static getParentFlowsArrayFromCurrentSection(state: QuestionFlowsStateModel) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.currentSectionQuestionFlows.forEach(id => {
      if (state.questionFlows[id].parentId === 0) {
        questionFlowsFromCurrentSection.push(state.questionFlows[id]);
      }
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getQuestionFlowsArrayFromCurrentSection(
    state: QuestionFlowsStateModel
  ) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.currentSectionQuestionFlows.forEach(id => {
      questionFlowsFromCurrentSection.push(state.questionFlows[id]);
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getCurrentQuestionFlow(state: QuestionFlowsStateModel) {
    return state.currentQuestionFlow;
  }
  //#endregion Selector

  //#region Reducer
  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    { patchState }: StateContext<QuestionFlowsStateModel>,
    { contractDetails }: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(contractDetails, contractDetailsSchema);
    patchState({
      questionFlows: normalizedData.entities.questionFlows
    });
  }

  @Action(QuestionFlowsActions.SetCurrentQuestionFlow)
  SetCurrentQuestionFlow(
    { patchState }: StateContext<QuestionFlowsStateModel>,
    { questionFlow }: QuestionFlowsActions.SetCurrentQuestionFlow
  ) {
    patchState({
      currentQuestionFlow: questionFlow
    });
  }

  @Action(QuestionFlowsActions.SetAnswer)
  SetAnswer(
    { patchState, getState, dispatch }: StateContext<QuestionFlowsStateModel>,
    { answer, flow }: QuestionFlowsActions.SetAnswer
  ) {
    const state = getState();
    patchState({
      questionFlows: {
        ...state.questionFlows,
        [flow.id]: {
          ...state.questionFlows[flow.id],
          answer: answer,
          completed: true
        }
      }
    });

    dispatch([
      new SectionsActions.UpdateCompletedQuestions(
        flow,
        answer,
        state.questionFlows
      ),
      new QuestionFlowsActions.SetCurrentQuestionFlow(
        state.questionFlows[flow.id]
      )
    ]);
  }

  @Action(QuestionFlowsActions.SetCurrentSectionQuestionFlows)
  CurrSectionQuestionFlows(
    { patchState, getState, dispatch }: StateContext<QuestionFlowsStateModel>,
    { section }: QuestionFlowsActions.SetCurrentSectionQuestionFlows
  ) {
    const state = getState();
    const flowIds: number[] = [];

    section.questionFlows.forEach(flow => {
      flowIds.push(state.questionFlows[+flow].id);
    });

    flowIds.forEach(id => {
      state.questionFlows[id].questionFlows.forEach(flow => {
        flowIds.push(state.questionFlows[+flow].id);
      });
    });

    patchState({
      currentSectionQuestionFlows: flowIds
    });

    dispatch(
      new QuestionFlowsActions.SetCurrentQuestionFlow(
        state.questionFlows[+section.questionFlows[0]]
      )
    );
  }
  //#endregion Reducer
}
