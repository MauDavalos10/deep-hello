import { LocalStorageKeys } from '@constants/enums';
import { FormData } from '../types';
import OnboardingService from './onboarding.service';

describe('OnboardingService', () => {
  let onboardingService: OnboardingService;
  const mockFile: File = new File(['file content'], 'test.txt', {
    type: 'text/plain',
  });
  const mockData = {
    accountCurrency: 'USD',
    accountNumber: '1234567890',
    accountType: 'Checking',
    bankStatement: mockFile,
  } as FormData;
  const mockResponseData = {
    accountCurrency: 'USD',
    accountNumber: '1234567890',
    accountType: 'Checking',
    bankStatement: 'bankStatement',
  };

  beforeEach(() => {
    onboardingService = new OnboardingService('test@email.com');
    localStorage.clear();
  });

  it('should build and retrieve data from localStorage', () => {
    onboardingService.buildStorage(mockData);
    const retrievedData = onboardingService.getFromStorage();
    expect(retrievedData).toEqual({
      ...mockResponseData,
      bankStatement: undefined,
    });
  });

  it('should return an empty object when retrieving from empty localStorage', () => {
    const retrievedData = onboardingService.getFromStorage();
    expect(retrievedData).toEqual({});
  });

  it('should clear the onboarding cache', () => {
    onboardingService.buildStorage(mockData);
    onboardingService.clearOnboardingCache();
    const retrievedData = onboardingService.getFromStorage();
    expect(retrievedData).toEqual({});
  });

  it('should store and retrieve data in localStorage', () => {
    onboardingService.buildStorage(mockData);
    const storedData = localStorage.getItem(
      LocalStorageKeys.ONBOARDING_PROCESS_DATA
    );
    const parsedData = storedData ? JSON.parse(storedData) : {};
    expect(parsedData).toEqual({
      userEmail: 'test@email.com',
      ...mockResponseData,
    });
  });

  it('should clear localStorage', async () => {
    onboardingService.clearOnboardingCache();
    const storedData = localStorage.getItem(
      LocalStorageKeys.ONBOARDING_PROCESS_DATA
    );
    const parsedData = storedData ? JSON.parse(storedData) : {};
    expect(parsedData).toStrictEqual({});
  });
});
