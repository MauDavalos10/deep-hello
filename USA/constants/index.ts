/* eslint-disable import/prefer-default-export */
export const USA_FORM_STEPS = {
  COMPANY_DOCUMENTATION: 0,
  BANK_INFORMATION: 1,
  IDENTIFICATION_OFFICIAL: 2,
  FINAL_QUESTIONS: 3,
  ONBOARDING_CONFIRMATION: 10,
};

export const USA_DIGITS_ACCOUNT_MIN = 5;
export const USA_DIGITS_ACCOUNT_MAX = 17;
export const USA_DIGITS_ROUTING = 9;
export const TEXTS_MAX_LENGTH = 30;

export const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export const websiteRegex =
  /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi;

export const usaPhoneRegex = /^[0-9]{10}$/;

export const taxIdRegex = /^[1-9]{2}\d?-?\d{7}$/;

export const nitIdRegex = /\d{11}[-]\d{1}$/;

export const onlyTextRegex = /^[A-Za-zÀ-ÿ ]*$/g;

export const anyTextRegex = /^[A-Za-zÀ-ÿ0-9 ]*$/g;

export const onlyNumbersRegex = /^\d+$/;

export const TOTAL_FILES_REQUIRED = {
  PASSPORT: 1,
  OTHERS: 2,
};
