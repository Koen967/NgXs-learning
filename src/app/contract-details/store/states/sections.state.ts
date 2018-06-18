import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as ContractDetailsActions from '../actions/contract-details.actions';
import * as SectionsActions from '../actions/sections.actions';
import produce from 'immer';

import {
  contractDetailsSchema,
  Section,
  QuestionFlow
} from '../../contract-details.model';
import { normalize } from 'normalizr';

import { ContractDetailsService } from '../../contract-details.service';
import { QuestionFlowsState } from './question-flows.state';

export class SectionsStateModel {
  sections: { [id: number]: Section };
  currentSection: number;
}

@State<SectionsStateModel>({
  name: 'sections',
  defaults: {
    sections: {},
    currentSection: null
  },
  children: [QuestionFlowsState]
})
export class SectionsState {
  //#region Selectors
  @Selector()
  static getSectionsArray(state: SectionsStateModel) {
    return Object.keys(state.sections).map(id => state.sections[id]);
  }

  @Selector()
  static getCurrentSection(state: SectionsStateModel) {
    return state.currentSection;
  }

  @Selector()
  static getParentFlowsArrayFromCurrentSection(state) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.sections[state.currentSection].questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(
        state.questionFlows.questionFlows[+questionFlow]
      );
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getQuestionFlowsArrayFromCurrentSection(state) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.sections[state.currentSection].questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(
        state.questionFlows.questionFlows[+questionFlow]
      );
    });

    questionFlowsFromCurrentSection.forEach(questionFlow => {
      questionFlow.questionFlows.forEach(childFlow => {
        questionFlowsFromCurrentSection.push(
          state.questionFlows.questionFlows[+childFlow]
        );
      });
    });

    return questionFlowsFromCurrentSection;
  }
  //#endregion Selectors

  //#region Reducer
  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    ctx: StateContext<SectionsStateModel>,
    action: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(
      action.contractDetails,
      contractDetailsSchema
    );
    ctx.setState({
      sections: normalizedData.entities.sections,
      currentSection: null
    });
  }

  @Action(SectionsActions.SetCurrentSection)
  setCurrentSection(
    ctx: StateContext<SectionsStateModel>,
    action: SectionsActions.SetCurrentSection
  ) {
    console.log('Setting current state');
    ctx.patchState({
      currentSection: action.section
    });
  }

  @Action(SectionsActions.UpdateCompletedQuestions)
  updateCompletedQuestions(
    ctx: StateContext<SectionsStateModel>,
    action: SectionsActions.UpdateCompletedQuestions
  ) {
    console.log('Setting state');
    const state = ctx.getState();
    if (action.questionFlow.questionFlows.length > 0) {
      let nChildQuestionFlows = 0;
      action.questionFlow.questionFlows.forEach(childFlow => {
        if (!action.questionFlows[+childFlow].completed) {
          nChildQuestionFlows++;
        }
      });
      if (action.questionFlow.answer !== action.answer) {
        if (action.questionFlow.showSubQuestionOn === action.answer) {
          if (!action.questionFlow.completed) {
            // If questionFlow has children, committed answer is different from current, it opens the subs and parent wasn't answered yet.
            ctx.setState(
              produce(ctx.getState(), draft => {
                draft.sections[state.currentSection].completedQuestions =
                  state.sections[state.currentSection].completedQuestions -
                  nChildQuestionFlows +
                  1;
              })
            );
          } else {
            // If questionFlow has children, committed answer is different from current, it opens the subs and parent was answered.
            ctx.setState(
              produce(ctx.getState(), draft => {
                draft.sections[state.currentSection].completedQuestions =
                  state.sections[state.currentSection].completedQuestions -
                  nChildQuestionFlows;
              })
            );
          }
        } else {
          if (!action.questionFlow.completed) {
            // If questionFlow has childeren, committed answer id different from current, it closes the subs and parent wasn't answered yet.
            ctx.setState(
              produce(ctx.getState(), draft => {
                draft.sections[state.currentSection].completedQuestions =
                  state.sections[state.currentSection].completedQuestions +
                  nChildQuestionFlows +
                  1;
              })
            );
          } else {
            // If questionFlow has childeren, committed answer id different from current, it closes the subs and parent was answered.
            ctx.setState(
              produce(ctx.getState(), draft => {
                draft.sections[state.currentSection].completedQuestions =
                  state.sections[state.currentSection].completedQuestions +
                  nChildQuestionFlows;
              })
            );
          }
        }
      }
    } else if (!action.questionFlow.completed) {
      // If questionFlow doesn't have children and wasn't completed yet.
      ctx.setState(
        produce(ctx.getState(), draft => {
          draft.sections[state.currentSection].completedQuestions =
            state.sections[state.currentSection].completedQuestions + 1;
        })
      );
    }
  }
  //#endregion Reducer
}
