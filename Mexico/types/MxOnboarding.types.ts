export interface MxOnboardinStageDocuments {
  addressLine1: string;
  businessSectorId: number;
  phoneNumber: string;
  postalCodeId: number;
  incorporation?: string;
  rfc: string;
  resourceStatament: boolean;
  resourceStatementOption: string;
  legalRepresentativeStatament: boolean;
  website?: string;
  idNumber?: string;
  idType?: string;
  citizenship?: string;
  externalNumber?: string;
  internalNumber?: string;
}

export interface MxOnboardinStageAccount {
  bankName: string;
  clabe: string;
  currency: string;
}

export interface RawDataDocuments {
  idNumber?: string;
  citizenship?: string;
  idType?: string;
  countryOrigin: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postCode: number;
  taxId: string;
  incorporation?: string;
  birthDate?: string;
  phoneNumber: string;
  neighborhood: string;
  resourceStatament: boolean;
  resourceStatementOption: string;
  legalRepresentativeStatament: boolean;
  businessSectorId: number;
  isLastStep: boolean;
  externalNumber?: string;
  internalNumber?: string;
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
