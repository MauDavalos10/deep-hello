/* eslint-disable import/extensions */
import documentsSvc from '@efex-services/documents/documentsSvc';
import useImmediateApiCall from '@main-hooks/useImmediateApiCall';
import { UseApiCallProps } from '@pages/lending/types';
import {
  IStakeholderRequest,
  IStakeholderResponse,
} from '@pages/onboarding/types/newStakeholderResponse';
import { selectBusiness } from '@pages/profile/store/selectors';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
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
    data: onboardingData,
    loading,
    error,
    invoke: uploadDocuments,
  } = useApiCall((values, stage) =>
    clientSvc.onboardingMx(Number(company?.enterpriseId), values, stage)
  );

  const { data: getOnbData, invoke: getOnboardingData } = useApiCall(() =>
    clientSvc.getOnboardingMx(Number(company?.enterpriseId))
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

  useEffect(() => {
    if (onboardingData && !error && data.isLastStep) {
      dispatch(fetchUserProfile());
    }
  }, [onboardingData, dispatch, error, data]);

  useEffect(() => {
    if (getOnbData) {
      const { bankAccount, ...rest } = getOnbData;
      const newData = partialOnboarding.buildFormData({
        ...bankAccount,
        ...rest,
      });
      setData({ ...data, ...(newData as unknown as FormData) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, getOnbData]);

  useEffect(() => {
    if (dataStakeHolderV2) {
      setStkPartials(partialOnboarding.buildNewStakeHolders(dataStakeHolderV2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStakeHolderV2]);

  useEffect(() => {
    getStakeHolderV2({ enterpriseId: company?.enterpriseId ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        onboardingData,
        onboardingDocuments,
        getOnbData,
        error,
        loading: loading || loadingDocuments,
        stkPartials,
        setFormValues,
        uploadDocuments,
        getOnboardingData,
        getStakeHolder: getStakeHolderV2,
        getOnboardingDocuments,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => useContext(FormContext);
