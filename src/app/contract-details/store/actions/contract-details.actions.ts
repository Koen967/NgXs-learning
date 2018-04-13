import { ContractDetail } from '../../contract-details.model';

export class GetContractDetails {
  static readonly type = '[CONTRACT DETAILS] Get contract details';

  constructor(public id: number) {}
}

export class GetContractDetailsSuccess {
  static readonly type = '[CONTRACT DETAILS] Get contract details success';

  constructor(public contractDetails: ContractDetail) {}
}

export class GetContractDetailsFailed {
  static readonly type = '[CONTRACT DETAILS] Get contract details failed';

  constructor(public error: any) {}
}
