import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store, Select } from '@ngxs/store';
import { ContractDetailsState } from '../store/states/contract-details.state';
import * as SectionActions from '../store/actions/sections.actions';
import * as QuestionFlowActions from '../store/actions/question-flows.actions';

import { Section } from '../contract-details.model';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionsComponent implements OnInit {
  @Select(ContractDetailsState.getSectionsArray)
  sections$: Observable<Section[]>;
  @Select(ContractDetailsState.getCurrentSection)
  currentSection$: Observable<Section>;

  constructor(private store: Store) {}

  ngOnInit() {}

  openQuestionFlows(section: Section) {
    this.store.dispatch(new SectionActions.SetCurrentSection(section));
  }
}
