export interface IOnboardingPartials {
  accountCurrency: string;
  accountNumber: string;
  accountType: string;
  addressLine1: string;
  addressLine2: string;
  bankCode: string;
  bankName: string;
  bankStatement: boolean;
  bankStatementFile: string;
  birthDate: string;
  certificate: boolean;
  certificateFile: string;
  citizenShip?: string;
  city: string;
  clabe: string;
  companyDocumentType: string;
  constitution: boolean;
  constitutionFileFile: string;
  documentType?: any;
  effectiveAt: string;
  einDocument: boolean;
  einDocumentFile: string;
  expiredAt: string;
  gender: string;
  generalDocument: boolean;
  generalDocumentBack: boolean;
  generalDocumentBackFile: string;
  generalDocumentFile: boolean;
  idFileBack: boolean;
  idFileBackFile: string;
  idFileFront: boolean;
  idFileFrontFile: string;
  idNumber?: string;
  idNumberFile: boolean;
  idType?: string;
  incorporation: string;
  industryCode: string;
  number: string;
  phoneNumber: string;
  phoneNumberEnterprise?: string;
  postCode: string;
  questions: QuestionsRespone[];
  question1?: string;
  question2?: string;
  question3?: string;
  question4?: string;
  question5?: string;
  question6?: string;
  question7?: string;
  question8?: string;
  residence: boolean;
  residenceFile: string;
  routingNumber: string;
  sat: boolean;
  satFile: string;
  serviceDocument: boolean;
  serviceDocumentFile: string;
  state: string;
  taxId: string;
  taxIdType: string;
  website: string;
}

interface QuestionsRespone {
  questionId: number;
  answer: string;
}
