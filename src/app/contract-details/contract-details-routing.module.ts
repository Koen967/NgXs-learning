import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractDetailsComponent } from './contract-details.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ContractDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ContractDetailsRoutingModule {}
