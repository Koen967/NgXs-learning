import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as ContractDetailsActions from '../actions/contract-details.actions';
import * as SectionsActions from '../actions/sections.actions';
import * as QuestionFlowActions from '../actions/question-flows.actions';
import produce from 'immer';

import {
  ContractDetail,
  contractDetailsSchema,
  Section,
  QuestionFlow
} from '../../contract-details.model';
import { normalize } from 'normalizr';

import { ContractDetailsService } from '../../contract-details.service';
import { QuestionFlowsState } from './question-flows.state';

export class SectionsStateModel {
  sections: { [id: number]: Section };
  currentSection: Section;
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

    state.currentSection.questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(
        state.questionFlows.questionFlows[+questionFlow]
      );
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getQuestionFlowsArrayFromCurrentSection(state) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.currentSection.questionFlows.forEach(questionFlow => {
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
    { setState }: StateContext<SectionsStateModel>,
    { contractDetails }: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(contractDetails, contractDetailsSchema);
    setState({
      sections: normalizedData.entities.sections,
      currentSection: null
    });
  }

  @Action(SectionsActions.SetCurrentSection)
  setCurrentSection(
    { patchState }: StateContext<SectionsStateModel>,
    { section }: SectionsActions.SetCurrentSection
  ) {
    patchState({
      currentSection: section
    });
  }

  @Action(SectionsActions.UpdateCompletedQuestions)
  updateCompletedQuestions(
    {
      patchState,
      getState,
      setState,
      dispatch
    }: StateContext<SectionsStateModel>,
    {
      questionFlow,
      answer,
      questionFlows
    }: SectionsActions.UpdateCompletedQuestions
  ) {
    const state = getState();
    if (questionFlow.questionFlows.length > 0) {
      let nChildQuestionFlows = 0;
      questionFlow.questionFlows.forEach(childFlow => {
        if (!questionFlows[+childFlow].completed) {
          nChildQuestionFlows++;
        }
      });
      if (questionFlow.answer !== answer) {
        if (questionFlow.showSubQuestionOn === answer) {
          if (!questionFlow.completed) {
            produce(state, draft => {
              draft.sections[state.currentSection.id].completedQuestions =
                draft.currentSection.completedQuestions -
                nChildQuestionFlows +
                1;
            });
            // If questionFlow has children, committed answer is different from current, it opens the subs and parent wasn't answered yet.
            patchState({
              sections: {
                ...state.sections,
                [state.currentSection.id]: {
                  ...state.sections[state.currentSection.id],
                  completedQuestions:
                    state.currentSection.completedQuestions -
                    nChildQuestionFlows +
                    1
                }
              }
            });
          } else {
            // If questionFlow has children, committed answer is different from current, it opens the subs and parent was answered.
            patchState({
              sections: {
                ...state.sections,
                [state.currentSection.id]: {
                  ...state.sections[state.currentSection.id],
                  completedQuestions:
                    state.currentSection.completedQuestions -
                    nChildQuestionFlows
                }
              }
            });
          }
        } else {
          if (!questionFlow.completed) {
            // If questionFlow has childeren, committed answer id different from current, it closes the subs and parent wasn't answered yet.
            patchState({
              sections: {
                ...state.sections,
                [state.currentSection.id]: {
                  ...state.sections[state.currentSection.id],
                  completedQuestions:
                    state.currentSection.completedQuestions +
                    nChildQuestionFlows +
                    1
                }
              }
            });
          } else {
            // If questionFlow has childeren, committed answer id different from current, it closes the subs and parent was answered.
            patchState({
              sections: {
                ...state.sections,
                [state.currentSection.id]: {
                  ...state.sections[state.currentSection.id],
                  completedQuestions:
                    state.currentSection.completedQuestions +
                    nChildQuestionFlows
                }
              }
            });
          }
        }
      }
    } else if (!questionFlow.completed) {
      // If questionFlow doesn't have children and wasn't completed yet.
      patchState({
        sections: {
          ...state.sections,
          [state.currentSection.id]: {
            ...state.sections[state.currentSection.id],
            completedQuestions: state.currentSection.completedQuestions + 1
          }
        }
      });
    }

    dispatch(
      new SectionsActions.SetCurrentSection(
        state.sections[state.currentSection.id]
      )
    );
  }
  //#endregion Reducer
}
