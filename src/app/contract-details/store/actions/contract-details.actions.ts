import { ContractDetail } from '../../contract-details.model';

export class GetContractDetails {
  static readonly type = '[CONTRACT DETAILS] Get contract details';
}

export class GetContractDetailsSuccess {
  static readonly type = '[CONTRACT DETAILS] Get contract details success';

  constructor(public contractDetails: ContractDetail) {}
}

export class GetContractDetailsFailed {
  static readonly type = '[CONTRACT DETAILS] Get contract details failed';
}

export type ContractDetailActionsAll =
  | GetContractDetails
  | GetContractDetailsSuccess
  | GetContractDetailsFailed;
