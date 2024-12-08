/* eslint-disable class-methods-use-this */
import { DateTime } from 'luxon';
import { LocalStorageKeys } from '@constants/enums';
import { FormData } from '../types';

const dateKeys = ['birthDate', 'incorporation'];

const fileKeys = [
  'bankStatement',
  'certificateFile',
  'constitutionFile',
  'idFileBack',
  'idFileFront',
  'residenceFile',
  'satFile',
];

export default class OnboardingService {
  userEmail: string;

  constructor(userEmail: string) {
    this.userEmail = userEmail;
  }

  private mutateFunction = (value: any, name: string) => {
    if (fileKeys.includes(name)) {
      this.gotFile(value as File, name);
      return name;
    }
    if (dateKeys.includes(name)) {
      return (value as DateTime).toISODate();
    }
    return value;
  };

  private recoverFunction = (value: any, name: string) => {
    if (fileKeys.includes(name)) {
      return this.getFile(name);
    }
    if (dateKeys.includes(name)) {
      return DateTime.fromISO(value);
    }
    return value;
  };

  private objectMutate = (object: any, isRecover = false) =>
    Object.keys(object).reduce((result: any, key: any) => {
      if (!isRecover) {
        result[key] = this.mutateFunction(object[key], key);
      }
      if (isRecover) {
        result[key] = this.recoverFunction(object[key], key);
      }
      return result;
    }, {});

  private gotFile = (file: File, name: string) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (base64) => {
      localStorage[name] = base64;
    };
    reader.readAsDataURL(file);
  };

  private getFile = (name: string): File | undefined => {
    try {
      const base64 = localStorage[name];
      const base64Parts = base64.split(',');
      const fileFormat = base64Parts[0].split(';')[1];
      const fileContent = base64Parts[1];
      const file = new File([fileContent], name, { type: fileFormat });
      return file;
    } catch {
      return undefined;
    }
  };

  clearOnboardingCache = () => {
    localStorage.removeItem(LocalStorageKeys.ONBOARDING_PROCESS_DATA);
    fileKeys.forEach((item) => localStorage.removeItem(item));
  };

  buildStorage = (data: FormData) => {
    if (!Object.keys(data).length) {
      return;
    }
    const fixedLocalData: { [propName: string]: any } = this.objectMutate(data);
    localStorage.setItem(
      LocalStorageKeys.ONBOARDING_PROCESS_DATA,
      JSON.stringify({ userEmail: this.userEmail, ...fixedLocalData })
    );
  };

  getFromStorage = (): FormData => {
    const onboardingData = localStorage.getItem(
      LocalStorageKeys.ONBOARDING_PROCESS_DATA
    );
    if (onboardingData) {
      const rawValues = JSON.parse(onboardingData);
      const fixedRetrievedData: { [propName: string]: any } = this.objectMutate(
        rawValues,
        true
      );
      const { userEmail: verifiedEmail, ...rest } = fixedRetrievedData;
      if (verifiedEmail !== this.userEmail) {
        return {} as FormData;
      }
      return rest as FormData;
    }
    return {} as FormData;
  };
}
