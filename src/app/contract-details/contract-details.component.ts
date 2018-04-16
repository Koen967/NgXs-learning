import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { QuestionFlowsState } from './store/states';
import { Observable } from 'rxjs/Observable';
import { QuestionFlow } from './contract-details.model';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractDetailsComponent implements OnInit {
  @Select(QuestionFlowsState.getParentFlowsArrayFromCurrentSection)
  parentFlows$: Observable<QuestionFlow[]>;

  constructor(private store: Store) {}

  ngOnInit() {}
}
