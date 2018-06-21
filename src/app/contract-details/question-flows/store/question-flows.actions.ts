import { Section, QuestionFlow } from '../../contract-details.model';

export class SetCurrentQuestionFlow {
  static readonly type = '[QUESTION FLOW] Set current question flow';

  constructor(public questionFlow: number) {}
}

export class SetAnswer {
  static readonly type = '[QUESTION FLOW] Set answer';

  constructor(public answer: any, public flow: QuestionFlow) {}
}

export class UpdateCurrentSection {
  static readonly type = '[SECTION] Update current section';

  constructor(public questionFlow: QuestionFlow, public answer: any) {}
}
