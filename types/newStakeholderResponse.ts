export interface IStakeholderRequest {
  enterpriseId: string;
}

export interface IStakeholderResponse {
  stakeholders: Stakeholder[];
}

interface Stakeholder {
  id: number;
  isActive: boolean;
  name: string;
  lastName: string;
  secondLastName: null;
  gender: null;
  curp: null;
  birthDate: string;
  citizenship: string;
  percentage: string;
  residence: null;
  title: string;
  nationalityPerson: null;
  countryBirthId: null;
  federalEntityId: null;
  nationalityCountry: null;
  businessSector: any;
  address: Address;
  documents: Document[];
  legalRepresentativeStatament: boolean;
  legalRepresentativeResponse?: string;
  resourceFamilyStatament: boolean;
  resourceFamilyStatamentResponse?: string;
  agreements?: Agreement[];
}

interface Agreement {
  agreement: AgreementID;
  agreementDetail: string;
  agreementValue: boolean;
}

interface AgreementID {
  id: number;
  name: string;
}

interface Document {
  id: number;
  document: Document;
}

interface Document {
  type: Type;
  location: string;
  version: string;
  metaData: Record<string, string>;
}

interface Type {
  id: number;
  name: string;
  description: string;
}

interface Address {
  id: number;
  isActive: boolean;
  name: string;
  city: string;
  state: string;
  extNumber: null;
  intNumber: null;
  postCode: string;
  postCodeId?: string;
  postalCodeId?: string;
  addressLine1?: string;
  addressLine2?: string;
  street?: string;
}
