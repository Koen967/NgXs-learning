import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as ContractDetailsActions from '../actions/contract-details.actions';
import * as SectionsActions from '../actions/sections.actions';
import * as QuestionFlowActions from '../actions/question-flows.actions';

import {
  ContractDetail,
  contractDetailsSchema,
  Section
} from '../../contract-details.model';
import { normalize } from 'normalizr';

import { ContractDetailsService } from '../../contract-details.service';
import {
  ContractDetailsStateModel,
  ContractDetailsState
} from './contract-details.state';

export class SectionsStateModel {
  sections: { [id: number]: Section };
  currentSection: Section;
}

@State<SectionsStateModel>({
  name: 'sections',
  defaults: {
    sections: {},
    currentSection: null
  }
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
  //#endregion Selectors

  //#region Reducer
  @Action(ContractDetailsActions.GetContractDetailsSuccess)
  getContractDetailsSuccess(
    { patchState }: StateContext<SectionsStateModel>,
    { contractDetails }: ContractDetailsActions.GetContractDetailsSuccess
  ) {
    const normalizedData = normalize(contractDetails, contractDetailsSchema);
    patchState({
      sections: normalizedData.entities.sections
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
    { patchState, getState, dispatch }: StateContext<SectionsStateModel>,
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
