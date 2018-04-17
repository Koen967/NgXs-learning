import {
  ContractDetail,
  Section,
  QuestionFlow
} from '../../contract-details.model';

export class SetCurrentContractDetails {
  static readonly type = '[SECTION] Set current contract details';

  constructor(public contractDetails: ContractDetail) {}
}

export class UpdateCompletedQuestions {
  static readonly type = '[SECTION] Update completed questions';

  constructor(
    public section: Section,
    public questionFlow: QuestionFlow,
    public answer: any,
    public questionFlows: any
  ) {}
}
