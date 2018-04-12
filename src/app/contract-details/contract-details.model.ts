import { normalize, schema } from 'normalizr';
export class ContractDetail {
  id: number;
  customerId: number;
  number: string;
  company: string;
  description: string;
  validFrom: Date;
  validUntil: Date;
  defaultCurrencyId: number;
  totalQuestions: number;
  completedQuestions: number;
  sections: Section[];
  parentSections: ParentSection[];
  revisions: Revision[];
}

export class Section {
  id: number;
  sequence: number;
  name: string;
  subName: string;
  totalQuestions: number;
  completedQuestions: number;
  selected: boolean;
  questionFlows: QuestionFlow[];
}

export class QuestionFlow {
  id: number;
  contractId: number;
  parentId: number;
  subSectionId: number;
  path: string;
  question: string;
  label: string;
  lookupEntity: string;
  endPoint: string;
  type: string;
  answer: string;
  currencyId: number;
  originalAnswer: string;
  contractLineId: number;
  completed: boolean;
  sequenceNumber: number;
  selected: boolean;
  showSubQuestionOn: string;
  companyDefaultAnswer: any;
  companyDefaultCurrency: any;
  dropdownValues: any;
  unitOfMeasurement: string;
  questionFlows: QuestionFlow[];
  exceptions: Exception[];
  useCompanyDefault: boolean;
  reviewedReason: any;
  disabled: boolean;
  purposeDetail: any;
}

export class Exception {
  id: number;
  contractLineId: number;
  questionFlowId: number;
  description: string;
  text: string;
  label: string;
  endPoint: string;
  answer: string;
  type: string;
  currencyId: number;
  dropdownValues: any;
  validFrom: Date;
  childExceptions: Exception[];
  useCompanyDefault: boolean;
  companyDefaultAnswer: string;
  tenderLanes: number[];
}

export class ParentSection {
  id: number;
  name: string;
  subSections: number[];
}

export class Revision {
  id: number;
  sequence: number;
  validFrom: Date;
  validUntill: Date;
  active: boolean;
}

/*  Normalizr
    Use const normalizedData = normalize(ContractDetails, contractDetailsSchema);
    to get a normalized contractDetails JSON Object.
*/
const questionFlowSchema = new schema.Entity('questionFlows');

const questionFlowsSchema = new schema.Array(questionFlowSchema);

questionFlowSchema.define({ questionFlows: questionFlowsSchema });

const sectionSchema = new schema.Entity('sections', {
  questionFlows: questionFlowsSchema
});

export const sectionsSchema = new schema.Array(sectionSchema);

export const contractDetailsSchema = new schema.Entity('contractDetails', {
  sections: sectionsSchema
});
