/* eslint-disable import/extensions */
import documentsSvc from '@efex-services/documents/documentsSvc';
import useImmediateApiCall from '@main-hooks/useImmediateApiCall';
import { selectBusiness } from '@pages/profile/store/selectors';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import authSvc from '@efex-services/auth/authSvc';
import { UseApiCallProps } from '@pages/lending/types';
import {
  IStakeholderResponse,
  IStakeholderRequest,
} from '@pages/onboarding/types/newStakeholderResponse';
import clientSvc from '../../../../services/client/clientSvc';
import { StakeHoldersFormData } from '../../../../services/client/types';
import { useAppDispatch } from '../../../../store';
import { fetchUserProfile } from '../../../profile/store';
import GetPartialOnboarding from '../services/getPartialOnboarding.service';
import { FormData } from '../types';

interface IFormProvider {
  children: JSX.Element;
}

export const FormContext = createContext<any>(null!);

export const FormProvider = ({ children }: IFormProvider) => {
  const dispatch = useAppDispatch();
  const company = useSelector(selectBusiness);
  const [data, setData] = useState<FormData>({} as FormData);
  const [stkPartials, setStkPartials] = useState<StakeHoldersFormData[]>([]);
  const partialOnboarding = new GetPartialOnboarding();

  const {
    data: onboardingDocuments,
    loading: loadingDocuments,
    retry: getOnboardingDocuments,
  } = useImmediateApiCall(() =>
    documentsSvc.getOnboardingDocuments(Number(company?.enterpriseId))
  );

  const {
    data: onboardingMexico,
    loading: loadingMexico,
    error: errorMexico,
    invoke: onboardingMx,
  } = useApiCall((values, stage) =>
    clientSvc.onboardingMx(Number(company?.enterpriseId), values, stage)
  );

  const {
    data: onboardingMexicoData,
    loading: loadingMexicoData,
    error: errorMexicoData,
    invoke: getOnboardingMx,
  } = useApiCall(() =>
    clientSvc.getOnboardingMx(Number(company?.enterpriseId))
  );

  const { data: countries, retry: getCountries } = useImmediateApiCall(
    (value: string) => authSvc.getCountries({ value })
  );

  const { data: birthcountries, retry: getBirthCountries } =
    useImmediateApiCall((value: string) => authSvc.getCountries({ value }));

  const { data: federalEntities, retry: getFederalEntities } =
    useImmediateApiCall((value: string) =>
      authSvc.getFederalEntities({ value })
    );

  const {
    data: dataStakeHolderV2,
    invoke: getStakeHolderV2,
  }: UseApiCallProps<IStakeholderResponse, IStakeholderRequest> = useApiCall(
    () =>
      clientSvc.getStakeHolderV2({ enterpriseId: company?.enterpriseId ?? '' })
  );

  const setFormValues = (values: FormData) => {
    setData((prevValues) => ({
      ...prevValues,
      ...values,
    }));
  };

  const buildMxOnboardingData = async () => {
    const newData = await partialOnboarding.buildFromMexicoPartials(
      onboardingMexicoData
    );
    setData({ ...data, ...(newData as FormData) });
  };

  useEffect(() => {
    if (data.isLastStep) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (onboardingMexico && !errorMexico && onboardingMexico.isLastStep) {
      dispatch(fetchUserProfile());
    }
  }, [onboardingMexico, dispatch, errorMexico, data]);

  useEffect(() => {
    if (dataStakeHolderV2) {
      setStkPartials([]);
      setStkPartials(partialOnboarding.buildNewStakeHolders(dataStakeHolderV2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStakeHolderV2]);

  useEffect(() => {
    if (onboardingMexicoData && !loadingMexicoData && !errorMexicoData) {
      buildMxOnboardingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingMexicoData, loadingMexicoData, errorMexicoData]);

  useEffect(() => {
    getStakeHolderV2({ enterpriseId: company?.enterpriseId ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        onboardingDocuments,
        error: errorMexico,
        loading: loadingDocuments || loadingMexico,
        stkPartials,
        onboardingMexico,
        onboardingMexicoData,
        countries,
        federalEntities,
        birthcountries,
        onboardingMx,
        setFormValues,
        getStakeHolder: getStakeHolderV2,
        getOnboardingDocuments,
        getOnboardingMx,
        getCountries,
        getFederalEntities,
        getBirthCountries,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => useContext(FormContext);
