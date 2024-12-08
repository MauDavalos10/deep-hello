import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';

export const PFAE_DOCUMENTS = [
  {
    name: 'csf',
    documentTypeId: OnboardingDocumentTypeIds.csf,
    label: 'regMxDocTax',
    translation: 'regMxDocTax',
  },
  {
    name: 'fiel',
    documentTypeId: OnboardingDocumentTypeIds.fiel,
    label: 'regMxDocAEC',
    translation: 'regMxDocAEC',
  },
];

export const PM_DOCUMENTS = [
  {
    name: 'constitutionFile',
    documentTypeId: OnboardingDocumentTypeIds.constitutionFile,
    label: 'onbIncorporationDocumentUSA',
    translation: 'onbIncorporationDocumentUSA',
  },
  {
    name: 'csf',
    documentTypeId: OnboardingDocumentTypeIds.csf,
    label: 'regMxDocTax',
    translation: 'regMxDocTax',
  },
  {
    name: 'rpc',
    documentTypeId: OnboardingDocumentTypeIds.rpc,
    label: 'regMxDocRPC',
    translation: 'regMxDocRPC',
  },
  {
    name: 'fiel',
    documentTypeId: OnboardingDocumentTypeIds.fiel,
    label: 'regMxDocAEC',
    translation: 'regMxDocAEC',
  },
  {
    name: 'legalRepresentativeGranted',
    documentTypeId: OnboardingDocumentTypeIds.legalRepresentativeGranted,
    label: 'regMxDocRep',
    translation: 'regMxDocRep',
  },
  {
    name: 'legalRepresentativeDni',
    documentTypeId: OnboardingDocumentTypeIds.legalRepresentativeDni,
    label: 'regMxDocRepId',
    translation: 'regMxDocRepId',
  },
];

export const ENTITY_DOCUMENTS = {
  COMPANY: PM_DOCUMENTS,
  PERSON: PFAE_DOCUMENTS,
};
