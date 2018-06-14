import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';

import { QuestionFlowsState } from '../store/states';
import { QuestionFlow } from '../contract-details.model';

import * as QuestionFlowActions from '../store/actions/question-flows.actions';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionFormComponent implements OnInit {
  @Select(QuestionFlowsState.getCurrentQuestionFlow)
  questionFlow$: Observable<QuestionFlow>;

  questionFlow: QuestionFlow;

  constructor(private store: Store) {}

  ngOnInit() {
    this.questionFlow$.subscribe(flow => {
      this.questionFlow = flow;
    });
  }

  setAnswer(answer: any) {
    this.store.dispatch(
      new QuestionFlowActions.SetAnswer(answer.value.choice, this.questionFlow)
    );
  }
}
