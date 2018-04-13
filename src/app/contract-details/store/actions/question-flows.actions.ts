import { Section } from '../../contract-details.model';

export class SetCurrentSection {
  static readonly type = '[QUESTION FLOW] Set current section';

  constructor(public section: Section) {}
}
