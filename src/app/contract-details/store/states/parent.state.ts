import { State, Selector } from '@ngxs/store';

import { SectionsState } from './sections.state';
import { QuestionFlowsState } from './question-flows.state';
import { QuestionFlow } from '../../contract-details.model';
import { SectionsStateModel } from './sections.state';
import { QuestionFlowsStateModel } from './question-flows.state';

@State({
  name: 'parent',
  children: [SectionsState, QuestionFlowsState]
})
export class ParentState {
  @Selector()
  static getParentFlowsArrayFromCurrentSection(
    sectionState: SectionsStateModel,
    questionFlowState: QuestionFlowsStateModel
  ) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    sectionState.currentSection.questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(
        questionFlowState.questionFlows[+questionFlow]
      );
    });

    return questionFlowsFromCurrentSection;
  }

  @Selector()
  static getQuestionFlowsArrayFromCurrentSection(
    sectionState: SectionsStateModel,
    questionFlowState: QuestionFlowsStateModel
  ) {
    const questionFlowsFromCurrentSection: QuestionFlow[] = [];

    sectionState.currentSection.questionFlows.forEach(questionFlow => {
      questionFlowsFromCurrentSection.push(
        questionFlowState.questionFlows[+questionFlow]
      );
    });

    questionFlowsFromCurrentSection.forEach(questionFlow => {
      questionFlow.questionFlows.forEach(childFlow => {
        questionFlowsFromCurrentSection.push(
          questionFlowState.questionFlows[+childFlow]
        );
      });
    });

    return questionFlowsFromCurrentSection;
  }
}
