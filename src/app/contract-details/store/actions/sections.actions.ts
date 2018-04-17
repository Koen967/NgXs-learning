import {
  ContractDetail,
  Section,
  QuestionFlow
} from '../../contract-details.model';

export class SetCurrentSection {
  static readonly type = '[SECTION] Set current section';

  constructor(public section: Section) {}
}

export class UpdateCompletedQuestions {
  static readonly type = '[SECTION] Update completed questions';

  constructor(
    public questionFlow: QuestionFlow,
    public answer: any,
    public questionFlows: any
  ) {}
}
