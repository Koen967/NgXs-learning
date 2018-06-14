import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { QuestionFlowsState, SectionsState } from '../store/states';
import { QuestionFlow, Section } from '../contract-details.model';
import { Observable } from 'rxjs';

import * as QuestionFlowActions from '../store/actions/question-flows.actions';

@Component({
  selector: 'app-question-flows',
  templateUrl: './question-flows.component.html',
  styleUrls: ['./question-flows.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionFlowsComponent implements OnInit {
  @Input() parentFlows: QuestionFlow[];

  @Select(SectionsState.getQuestionFlowsArrayFromCurrentSection)
  questionFlows$: Observable<QuestionFlow[]>;
  @Select(QuestionFlowsState.getCurrentQuestionFlow)
  currentQuestionFlow$: Observable<QuestionFlow>;

  questionFlows: QuestionFlow[];

  constructor(private store: Store) {}

  ngOnInit() {
    this.questionFlows$.subscribe(flows => {
      this.questionFlows = flows;
    });
  }

  openQuestionFlowForm(questionFlow) {
    this.store.dispatch(
      new QuestionFlowActions.SetCurrentQuestionFlow(questionFlow)
    );
  }

  childQuestionFlows(questionFlow: QuestionFlow) {
    return this.questionFlows.filter(flow => flow.parentId === questionFlow.id);
  }
}
