import { IOnboardingDocuments } from '@efex-services/documents/documentsSvc';
import { DateTime } from 'luxon';

export type MexicoStakeHoldersFormData = {
  id?: number;
  name: string;
  lastName: string;
  secondLastName: string;
  birthDate: DateTime;
  citizenship: string;
  percentage: string;
  title: string;
  idType: string;
  idNumber: string;
  idFileFront: File | undefined;
  idFileBack: File | undefined;
  addressLine1: string;
  residenceFile: File | undefined;
  addressLine2: string;
  city: string;
  state: string;
  isIdFileFront?: string;
  isIdFileBack?: string;
  isResidenceFile?: string;
  dataConfirm?: boolean;
  gender: 'Male' | 'Female';
  nationalityPersonId?: string;
  countryBirthId?: string;
  federalEntityId?: string;
  curp?: string;
  neighborhood?: string;
  postCode: string;
  postCodeId?: number;
  documents?: IOnboardingDocuments[];
  resourceFamilyStatament: boolean;
  resourceFamilyStatamentResponse?: string;
  legalRepresentativeStatament: boolean;
  legalRepresentativeResponse?: string;
  extNumber?: string;
  intNumber?: string;
  businessSectorId: number;
};

export interface IMexicoStakeholdersPartials {
  stakeholders: MexicoStakeholder[];
  address: Address[];
}

interface Address {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  city: string;
  state: string;
  street?: string;
  ext_number?: any;
  int_number?: any;
  post_code: number;
  address_line1: string;
  address_line2: string;
  enterprise: number;
  stakeholder: number;
}

interface MexicoStakeholder {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  lastName: string;
  secondLastName: string;
  birth_date: string;
  citizenship: string;
  number_id: string;
  type_document: string;
  percentage: string;
  residence: string;
  title: string;
  file_front: string;
  file_back?: string;
  residence_file: string;
  enterprise: number;
  gender: 'Male' | 'Female';
  nationalityPersonId?: string;
  countryBirthId?: string;
  federalEntityId?: string;
  curp?: string;
  neighborhood?: string;
  legalRepresentativeStatament: boolean;
  legalRepresentativeResponse?: string;
  resourceFamilyStatament: boolean;
  resourceFamilyStatamentResponse?: string;
}
