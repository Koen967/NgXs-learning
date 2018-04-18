import { State, Selector } from '@ngxs/store';

import { SectionsState } from './sections.state';
import { QuestionFlowsState } from './question-flows.state';
import { QuestionFlow, Section } from '../../contract-details.model';
import { SectionsStateModel } from './sections.state';
import { QuestionFlowsStateModel } from './question-flows.state';

@State({
  name: 'parent',
  children: [SectionsState, QuestionFlowsState]
})
export class ParentState {
  @Selector()
  static getParentFlowsArrayFromCurrentSection(state) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    state.currentSection.questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(state.questionFlows[+questionFlow]);
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getQuestionFlowsArrayFromCurrentSection(state) {
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
}
