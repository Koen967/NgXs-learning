import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { QuestionFlowsState, SectionsState } from '../store/states';
import { QuestionFlow, Section } from '../contract-details.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-question-flows',
  templateUrl: './question-flows.component.html',
  styleUrls: ['./question-flows.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionFlowsComponent implements OnInit {
  @Select(QuestionFlowsState.getQuestionFlowsArrayFromCurrentSection)
  parentFlows$: Observable<QuestionFlow[]>;

  constructor(private store: Store) {}

  ngOnInit() {}
}
