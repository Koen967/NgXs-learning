import {
  State,
  Action,
  StateContext,
  Selector
} from '@ngxs/store';
import * as ContractDetailsActions from '../../store/actions/contract-details.actions';
import * as SectionsActions from '../../sections/store/sections.actions';
import * as QuestionFlowsActions from '../../question-flows/store/question-flows.actions';

import {
  contractDetailsSchema,
  QuestionFlow
} from '../../contract-details.model';
import { normalize } from 'normalizr';
import produce from 'immer';

export class QuestionFlowsStateModel {
  questionFlows: { [id: number]: QuestionFlow };
  currentQuestionFlow: number;
}

@State<QuestionFlowsStateModel>({
  name: 'questionFlows',
  defaults: {
    questionFlows: {},
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
  static getCurrentQuestionFlow(state: QuestionFlowsStateModel) {
    return state.questionFlows[state.currentQuestionFlow];
  }
  //#endregion Selector

  //#region Reducer
  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    ctx: StateContext<QuestionFlowsStateModel>,
    action: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(
      action.contractDetails,
      contractDetailsSchema
    );
    ctx.setState({
      questionFlows: normalizedData.entities.questionFlows,
      currentQuestionFlow: null
    });
  }

  @Action(QuestionFlowsActions.SetCurrentQuestionFlow)
  SetCurrentQuestionFlow(
    ctx: StateContext<QuestionFlowsStateModel>,
    action: QuestionFlowsActions.SetCurrentQuestionFlow
  ) {
    ctx.patchState({
      currentQuestionFlow: action.questionFlow
    });
  }

  @Action(QuestionFlowsActions.SetAnswer)
  SetAnswer(
    ctx: StateContext<QuestionFlowsStateModel>,
    action: QuestionFlowsActions.SetAnswer
  ) {
    const state = ctx.getState();
    ctx.setState(
      produce(ctx.getState(), draft => {
        draft.questionFlows[action.flow.id].answer = action.answer;
        draft.questionFlows[action.flow.id].completed = true;
      })
    );

    ctx.dispatch(
      new SectionsActions.UpdateCompletedQuestions(
        action.flow,
        action.answer,
        state.questionFlows
      )
    );
  }
  //#endregion Reducer
}
