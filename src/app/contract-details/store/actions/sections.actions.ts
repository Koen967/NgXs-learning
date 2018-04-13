import { ContractDetail } from '../../contract-details.model';

export class SetCurrentContractDetails {
  static readonly type = '[SECTIONS] Set current contract details';

  constructor(public contractDetails: ContractDetail) {}
}
