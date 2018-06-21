import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, Select } from '@ngxs/store';
import { SectionsState, QuestionFlowsState } from '../store/states';
import * as SectionActions from '../sections/store/sections.actions';
import * as QuestionFlowActions from '../question-flows/store/question-flows.actions';

import { Section } from '../contract-details.model';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionsComponent implements OnInit {
  @Select(SectionsState.getSectionsArray) sections$: Observable<Section[]>;
  @Select(SectionsState.getCurrentSection) currentSection$: Observable<Section>;

  constructor(private store: Store) {}

  ngOnInit() {}

  openQuestionFlows(section: Section) {
    this.store.dispatch([
      new SectionActions.SetCurrentSection(section.id),
      new QuestionFlowActions.SetCurrentQuestionFlow(+section.questionFlows[0])
    ]);
  }
}
