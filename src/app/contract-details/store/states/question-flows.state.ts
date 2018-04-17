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

export class QuestionFlowsStateModel {
  questionFlows: { [id: number]: QuestionFlow };
  currentSection: Section;
  currentQuestionFlow: QuestionFlow;
}

@State<QuestionFlowsStateModel>({
  name: 'questionFlows',
  defaults: {
    questionFlows: {},
    currentSection: null,
    currentQuestionFlow: null
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

    state.currentSection.questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(state.questionFlows[+questionFlow]);
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getQuestionFlowsArrayFromCurrentSection(
    state: QuestionFlowsStateModel
  ) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.currentSection.questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(state.questionFlows[+questionFlow]);
    });

    questionFlowsFromCurrentSection.forEach(questionFlow => {
      questionFlow.questionFlows.forEach(childFlow => {
        questionFlowsFromCurrentSection.push(state.questionFlows[+childFlow]);
      });
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getCurrentSection(state: QuestionFlowsStateModel) {
    return state.currentSection;
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

  @Action(QuestionFlowsActions.SetCurrentSection)
  SetCurrentSection(
    { patchState, getState, dispatch }: StateContext<QuestionFlowsStateModel>,
    { section }: QuestionFlowsActions.SetCurrentSection
  ) {
    const state = getState();

    patchState({
      currentSection: section
    });

    dispatch(
      new QuestionFlowsActions.SetCurrentQuestionFlow(
        state.questionFlows[+section.questionFlows[0]]
      )
    );
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
        state.currentSection,
        flow,
        answer,
        state.questionFlows
      ),
      new QuestionFlowsActions.SetCurrentQuestionFlow(
        state.questionFlows[flow.id]
      )
    ]);
  }
  //#endregion Reducer
}
