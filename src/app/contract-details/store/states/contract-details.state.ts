import { State, Action, StateContext, Selector } from '@ngxs/store';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import {
  ContractDetail,
  contractDetailsSchema,
  Section,
  QuestionFlow
} from '../../contract-details.model';
import { normalize } from 'normalizr';

import { ContractDetailsService } from '../../contract-details.service';

import * as ContractDetailsActions from '../actions/contract-details.actions';
import * as SectionsActions from '../actions/sections.actions';
import * as QuestionFlowsActions from '../actions/question-flows.actions';

export class ContractDetailsStateModel {
  contractDetails: { [id: number]: ContractDetail };
  sections: { [id: number]: Section };
  questionFlows: { [id: number]: QuestionFlow };
  currentSection: Section;
  currentQuestionFlow: QuestionFlow;
  loading: boolean;
  loaded: boolean;
}

@State<ContractDetailsStateModel>({
  name: 'contractDetails',
  defaults: {
    contractDetails: {},
    sections: {},
    questionFlows: {},
    currentSection: null,
    currentQuestionFlow: null,
    loading: false,
    loaded: false
  }
})
export class ContractDetailsState {
  constructor(private contractDetailsService: ContractDetailsService) {}

  //#region Selectors ContractDetails
  @Selector()
  static getContractDetailsLoaded(state: ContractDetailsStateModel) {
    return state.loaded;
  }
  //#endregion Selectors ContractDetails

  //#region Selectors Sections
  @Selector()
  static getSectionsArray(state: ContractDetailsStateModel) {
    return Object.keys(state.sections).map(id => state.sections[id]);
  }

  @Selector()
  static getCurrentSection(state: ContractDetailsStateModel) {
    return state.currentSection;
  }
  //#endregion Selectors Sections

  //#region Selectors QuestionFlow
  @Selector()
  static getQuestionFlowsArray(state: ContractDetailsStateModel) {
    return Object.keys(state.questionFlows).map(id => state.questionFlows[id]);
  }

  @Selector()
  static getParentFlowsArrayFromCurrentSection(
    state: ContractDetailsStateModel
  ) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.currentSection.questionFlows.forEach(id => {
      questionFlowsFromCurrentSection.push(state.questionFlows[+id]);
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getQuestionFlowsArrayFromCurrentSection(
    state: ContractDetailsStateModel
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
  static getCurrentQuestionFlow(state: ContractDetailsStateModel) {
    return state.currentQuestionFlow;
  }
  //#endregion Selector QuestionFlow

  //#region Reducer ContractDetails
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
      sections: normalizedData.entities.sections,
      questionFlows: normalizedData.entities.questionFlows,
      currentSection: null,
      currentQuestionFlow: null,
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
  //#endregion Reducer ContractDetails

  //#region Reducer Sections
  @Action(SectionsActions.SetCurrentSection)
  setCurrentSection(
    { patchState, dispatch, getState }: StateContext<ContractDetailsStateModel>,
    { section }: SectionsActions.SetCurrentSection
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

  @Action(SectionsActions.UpdateCompletedQuestions)
  updateCompletedQuestions(
    { patchState, getState, dispatch }: StateContext<ContractDetailsStateModel>,
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
  //#endregion Reducer Sections

  //#region Reducer QuestionFlows
  @Action(QuestionFlowsActions.SetCurrentQuestionFlow)
  SetCurrentQuestionFlow(
    { patchState }: StateContext<ContractDetailsStateModel>,
    { questionFlow }: QuestionFlowsActions.SetCurrentQuestionFlow
  ) {
    patchState({
      currentQuestionFlow: questionFlow
    });
  }

  @Action(QuestionFlowsActions.SetAnswer)
  SetAnswer(
    { patchState, getState, dispatch }: StateContext<ContractDetailsStateModel>,
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
  //#endregion Reducer QuestionFlows
}
