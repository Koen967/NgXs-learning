import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractDetailsComponent } from './contract-details.component';
import { ContractDetailsGuard } from './store/guards/contract-details.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ContractDetailsComponent,
    canActivate: [ContractDetailsGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ContractDetailsGuard]
})
export class ContractDetailsRoutingModule {}
