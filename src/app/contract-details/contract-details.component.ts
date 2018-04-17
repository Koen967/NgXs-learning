import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { QuestionFlowsState, SectionsState, ParentState } from './store/states';
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
  @Select(ParentState.getParentFlowsArrayFromCurrentSection)
  parentFlows$: Observable<QuestionFlow[]>;
  @Select(SectionsState.getSectionsArray) sections$: Observable<Section[]>;
  @Select(ParentState.getQuestionFlowsArrayFromCurrentSection)
  questionFlows$: Observable<QuestionFlow[]>;
  @Select(SectionsState.getCurrentSection) currSection$: Observable<Section>;
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

  previousQuestion(event) {
    if (this.currentQuestionFlow.parentId === 0) {
      if (
        this.questionFlows.find(
          flow => +flow.path === +this.currentQuestionFlow.path - 1
        )
      ) {
        if (
          this.questionFlows.find(
            flow => +flow.path === +this.currentQuestionFlow.path - 1
          ).questionFlows.length > 0 &&
          this.questionFlows.find(
            flow => +flow.path === +this.currentQuestionFlow.path - 1
          ).showSubQuestionOn ===
            this.questionFlows.find(
              flow => +flow.path === +this.currentQuestionFlow.path - 1
            ).answer
        ) {
          let highestPath = 0;
          this.questionFlows
            .find(flow => +flow.path === +this.currentQuestionFlow.path - 1)
            .questionFlows.forEach(questionFlow => {
              if (
                +this.questionFlows.find(flow => flow.id === +questionFlow)
                  .path > highestPath
              ) {
                highestPath = +this.questionFlows.find(
                  flow => flow.id === +questionFlow
                ).path;
              }
            });
          const nextQuestionFlow = this.questionFlows.find(
            flow => +flow.path === highestPath
          );
          this.store.dispatch(
            new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
          );
        } else {
          const nextQuestionFlow = this.questionFlows.find(
            flow => +flow.path === +this.currentQuestionFlow.path - 1
          );
          this.store.dispatch(
            new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
          );
        }
      } else if (
        this.sections.find(
          section => section.sequence === this.currentSection.sequence - 1
        )
      ) {
        const nextSection = this.sections.find(
          section => section.sequence === this.currentSection.sequence - 1
        );
        this.store.dispatch(
          new QuestionFlowActions.SetCurrentSection(nextSection)
        );

        let nextQuestionFlow = this.questionFlows[
          this.questionFlows.length - 1
        ];
        if (nextQuestionFlow.parentId !== 0) {
          const parentFlow = this.questionFlows.find(
            flow => flow.id === nextQuestionFlow.parentId
          );
          if (parentFlow.showSubQuestionOn === parentFlow.answer) {
            this.questionFlows.forEach(questionFlow => {
              if (+questionFlow.path > +nextQuestionFlow.path) {
                nextQuestionFlow = questionFlow;
              }
            });
          } else {
            nextQuestionFlow = parentFlow;
          }
        }
        this.store.dispatch(
          new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
        );
      }
    } else {
      const nextQuestionFlow = this.questionFlows.find(
        flow =>
          (+flow.path).toFixed(2) ===
          (+this.currentQuestionFlow.path - 0.1).toFixed(2)
      );
      this.store.dispatch(
        new QuestionFlowActions.SetCurrentQuestionFlow(nextQuestionFlow)
      );
    }
  }
}
