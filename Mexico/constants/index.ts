/* eslint-disable import/prefer-default-export */
export const ONBOARDING_MEXICO_FORM_STEPS = {
  DOCUMENTATIONS: 0,
  COMPANY_DOCUMENTATION: 1,
  BANK_INFORMATION: 2,
  BENEFICIAL_OWNERS: 3,
  ONBOARDING_CONFIRMATION: 10,
};

export const MX_DIGITS_CLABE = 18;

export const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export const websiteRegex =
  /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi;

export const taxIdRegex = /^[1-9]{2}\d?-?\d{7}$/;

export const onlyTextRegex = /^[A-Za-zÀ-ÿ ]*$/g;

export const anyTextRegex = /^[A-Za-zÀ-ÿ0-9 ]*$/g;

export const onlyNumbersRegex = /^\d+$/;

export const documentTypeOptions: { key: string; value: string }[] = [
  { value: 'INE', key: 'INE' },
  { value: 'PASS', key: 'PssType' },
];
export const addressMaxLength = 70;

export const STAKEHOLDER_AGREEMENTS = {
  RESOURCE: 1,
  LEGAL_REPRESENTATIVE: 2,
};
