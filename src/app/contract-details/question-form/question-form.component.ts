import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';

import { QuestionFlowsState, SectionsState } from '../store/states';
import { QuestionFlow } from '../contract-details.model';

import * as QuestionFlowActions from '../store/actions/question-flows.actions';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionFormComponent implements OnInit {
  @Select(SectionsState.getQuestionFlowsArrayFromCurrentSection)
  questionFlows$: Observable<QuestionFlow[]>;
  @Select(QuestionFlowsState.getCurrentQuestionFlow)
  questionFlow$: Observable<number>;

  questionFlows: QuestionFlow[];
  questionFlow: QuestionFlow;

  constructor(private store: Store) {}

  ngOnInit() {
    this.questionFlows$.subscribe(flows => {
      this.questionFlows = flows;
    });
    this.questionFlow$.subscribe(flow => {
      this.questionFlow = this.questionFlows.find(array => array.id === flow);
    });
    console.log('FORM', this.questionFlow);
  }

  setAnswer(answer: any) {
    this.store.dispatch(
      new QuestionFlowActions.SetAnswer(answer.value.choice, this.questionFlow)
    );
  }
}
