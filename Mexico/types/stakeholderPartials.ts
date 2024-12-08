export interface IStakeholdersPartials {
  stakeholders: Stakeholder[];
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
  post_code: string;
  address_line1: string;
  address_line2: string;
  enterprise: number;
  stakeholder: number;
}

interface Stakeholder {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
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
}
