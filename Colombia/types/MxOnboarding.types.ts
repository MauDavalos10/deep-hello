export interface MxOnboardinStageDocuments {
  addressLine1: string;
  businessSectorId: string;
  phoneNumber: string;
  postalCodeId: number;
  incorporation: string;
  rfc: string;
  resourceStatament: boolean;
  resourceStatementOption: string;
  legalRepresentativeStatament: boolean;
}

export interface MxOnboardinStageAccount {
  bankName: string;
  bankCode: string;
  accountType: string;
  accountNumber: string;
  routingNumber: string;
  clabe: string;
  currency: string;
}

export interface RawDataDocuments {
  countryOrigin: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postCode: number;
  taxId: string;
  incorporation: string;
  phoneNumber: string;
  neighborhood: string;
  resourceStatament: boolean;
  resourceStatementOption: string;
  legalRepresentativeStatament: boolean;
  businessSectorId: string;
  isLastStep: boolean;
}
export interface RawDataAccount {
  isLastStep: boolean;
  bankName: string;
  accountNumber: string;
  accountCurrency: string;
  bankCode: string;
  accountType: string;
  routingNumber: string;
  bankStatement: File;
  isFirstAccount: boolean;
}

export interface MxOnboardingRequest extends RawDataDocuments, RawDataAccount {}
