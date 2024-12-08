import { OnboardingUsaDocumentTypeIds } from '@efex-services/documents/types';

export const USA_COMPANY_DOCUMENTS = [
  {
    name: 'passport',
    documentTypeId: OnboardingUsaDocumentTypeIds.passport,
    label: 'usaDocPassport',
    translation: 'usaDocPassport',
  },
  {
    name: 'personalId',
    documentTypeId: OnboardingUsaDocumentTypeIds.personalId,
    label: 'usaDocPersonalId',
    translation: 'usaDocPersonalId',
  },
  {
    name: 'personalIdBack',
    documentTypeId: OnboardingUsaDocumentTypeIds.personalIdBack,
    label: 'usaDocPersonalIdBack',
    translation: 'usaDocPersonalIdBack',
  },
  {
    name: 'driversLicence',
    documentTypeId: OnboardingUsaDocumentTypeIds.driversLicence,
    label: 'usaDocDriversLicence',
    translation: 'usaDocDriversLicence',
  },
  {
    name: 'driversLicenceBack',
    documentTypeId: OnboardingUsaDocumentTypeIds.driversLicenceBack,
    label: 'usaDocDriversLicenceBack',
    translation: 'usaDocDriversLicenceBack',
  },
];

export const USA_COMPANY_DOCUMENTS_LABELS = [
  USA_COMPANY_DOCUMENTS[0],
  USA_COMPANY_DOCUMENTS[1],
  USA_COMPANY_DOCUMENTS[3],
];
