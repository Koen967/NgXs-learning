import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { QuestionFlowsState, SectionsState } from './store/states';
import { Observable } from 'rxjs/Observable';
import { QuestionFlow, Section } from './contract-details.model';

import * as QuestionFlowActions from '../contract-details/store/actions/question-flows.actions';
@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractDetailsComponent implements OnInit {
  @Select(QuestionFlowsState.getParentFlowsArrayFromCurrentSection)
  parentFlows$: Observable<QuestionFlow[]>;
  @Select(SectionsState.getSectionsArray) sections$: Observable<Section[]>;
  @Select(QuestionFlowsState.getQuestionFlowsArrayFromCurrentSection)
  questionFlows$: Observable<QuestionFlow[]>;
  @Select(QuestionFlowsState.getCurrentSection)
  currSection$: Observable<Section>;
  @Select(QuestionFlowsState.getCurrentQuestionFlow)
  currQuestionFlow$: Observable<QuestionFlow>;

  currentSection: Section;
  currentQuestionFlow: QuestionFlow;
  questionFlows: QuestionFlow[];
  sections: Section[];

  constructor(private store: Store) {}

  ngOnInit() {
    this.currSection$.subscribe(section => {
      this.currentSection = section;
    });

    this.currQuestionFlow$.subscribe(questionFlow => {
      this.currentQuestionFlow = questionFlow;
    });

    this.questionFlows$.subscribe(questionFlows => {
      this.questionFlows = questionFlows;
    });

    this.sections$.subscribe(sections => {
      this.sections = sections;
    });

    this.setInitialSelection();
  }

  setInitialSelection() {
    let section: Section;
    this.sections$.subscribe(sections => {
      section = sections[0];
    });
    this.store.dispatch(new QuestionFlowActions.SetCurrentSection(section));
  }

  nextQuestion() {
    if (this.currentQuestionFlow.questionFlows.length > 0) {
      if (
        this.currentQuestionFlow.answer ===
        this.currentQuestionFlow.showSubQuestionOn
      ) {
        const nextQuestionFlow = this.questionFlows.find(
          flow => +flow.path === +this.currentQuestionFlow.path + 0.1
        );
        this.store.dispatch(
          new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
        );
      } else {
        if (
          this.questionFlows.find(
            flow => +flow.path === +this.currentQuestionFlow.path + 1
          )
        ) {
          const nextQuestionFlow = this.questionFlows.find(
            flow => +flow.path === +this.currentQuestionFlow.path + 1
          );
          this.store.dispatch(
            new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
          );
        } else {
          const nextSection = this.sections.find(
            section => section.sequence === this.currentSection.sequence + 1
          );
          this.store.dispatch(
            new QuestionFlowActions.SetCurrentSection(nextSection)
          );
        }
      }
    } else {
      if (this.currentQuestionFlow.parentId === 0) {
        if (
          this.questionFlows.find(
            questionFlow =>
              +questionFlow.path === +this.currentQuestionFlow.path + 1
          )
        ) {
          const nextQuestionFlow = this.questionFlows.find(
            questionFlow =>
              +questionFlow.path === +this.currentQuestionFlow.path + 1
          );
          this.store.dispatch(
            new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
          );
        } else {
          const nextSection = this.sections.find(
            section => section.sequence === this.currentSection.sequence + 1
          );
          this.store.dispatch(
            new QuestionFlowActions.SetCurrentSection(nextSection)
          );
        }
      } else if (
        this.questionFlows.find(
          questionFlow =>
            (+questionFlow.path).toFixed(2) ===
            (+this.currentQuestionFlow.path + 0.1).toFixed(2)
        )
      ) {
        const nextQuestionFlow = this.questionFlows.find(
          questionFlow =>
            (+questionFlow.path).toFixed(2) ===
            (+this.currentQuestionFlow.path + 0.1).toFixed(2)
        );
        this.store.dispatch(
          new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
        );
      } else if (
        this.questionFlows.find(
          questionFlow =>
            Math.floor(+questionFlow.path) ===
            Math.floor(+this.currentQuestionFlow.path) + 1
        )
      ) {
        const nextQuestionFlow = this.questionFlows.find(
          questionFlow =>
            Math.floor(+questionFlow.path) ===
            Math.floor(+this.currentQuestionFlow.path) + 1
        );
        this.store.dispatch(
          new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
        );
      } else {
        const nextSection = this.sections.find(
          section => section.sequence === this.currentSection.sequence + 1
        );
        this.store.dispatch(
          new QuestionFlowActions.SetCurrentSection(nextSection)
        );
      }
    }
  }

  previousQuestion() {}
}
