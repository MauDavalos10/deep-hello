export interface UsaDocument {
  website: string;
  companyDocumentType: string;
  phoneNumber: string;
  postCode: string;
  incorporation: string;
  taxId: string;
  taxIdType: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  number: string;
  industryCode: string;
  gender?: string;
}

export interface UsaAccount {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
}

export interface UsaEfexAccount {
  isFirstAccount: boolean;
}

export interface UsaQuestions {
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  question6: string;
}
