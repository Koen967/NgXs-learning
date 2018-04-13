import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { NgxsModule } from '@ngxs/store';
import {
  ContractDetailsState,
  SectionsState,
  QuestionFlowsState
} from './store/states';
import { ContractDetailsRoutingModule } from './contract-details-routing.module';

import { QuestionFlowsComponent } from './question-flows/question-flows.component';
import { SectionsComponent } from './sections/sections.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { ContractDetailsComponent } from './contract-details.component';

import { ContractDetailsService } from './contract-details.service';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      ContractDetailsState,
      SectionsState,
      QuestionFlowsState
    ]),
    ContractDetailsRoutingModule,
    HttpClientModule
  ],
  declarations: [
    ContractDetailsComponent,
    SectionsComponent,
    QuestionFlowsComponent,
    QuestionFormComponent
  ],
  providers: [ContractDetailsService]
})
export class ContractDetailsModule {}
