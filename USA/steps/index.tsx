/* eslint-disable react-hooks/exhaustive-deps */
import { Country } from '@configs/language';
import {
  IOnboardingFormData,
  IUploadDocumentsOnboarding,
} from '@efex-services/client/types';
import { Alert, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { USA_FORM_STEPS } from '../constants';
import { useFormData } from '../context';
import ConvertFormToRequest from '../services/ConvertFormToRequest';
import { FormData as OnboardingFormData } from '../types';
import BankingInformation from './BankingInformation';
import CompanyDocumentation from './CompanyDocumentation';
import EfexFirstUsaBank from './EfexFirstUsaBank';
import FinalQuestions from './FinalQuestions';
import OnboardingConfirmation from './OnboardingConfirmation';
import StakeHolders from './StakeHolders';
import { FORM_STEP_FIELDS } from '../constants/stages';

interface IOnboardingForm {
  formStep: number;
  countryOrigin: Country | undefined;
  isDisabledEdit?: boolean;
  uploadCompleted: () => void;
  setFormStep: (step: number) => void;
}

const OnboardingForm = ({
  formStep,
  countryOrigin,
  isDisabledEdit = false,
  uploadCompleted,
  setFormStep,
}: IOnboardingForm) => {
  const { t } = useTranslation();
  const convertFormToRequest = new ConvertFormToRequest();
  const navigate = useNavigate();
  const [isLast, setIsLast] = useState(false);
  const [isFirstBankAccountControl, setIsFirstBankAccountControl] =
    useState(true);
  const { error, loading, onboardingData, setFormValues, uploadDocuments } =
    useFormData();

  const nextFormStep = () => setFormStep(formStep + 1);
  const prevFormStep = () => setFormStep(formStep - 1);

  const buildDataAndSave = (values: OnboardingFormData) => {
    let data;
    const { isLastStep } = values;
    setIsLast(isLastStep);
    let fixedValues: OnboardingFormData = {
      ...values,
    };
    if (isLastStep) {
      fixedValues = { ...fixedValues, completed: true };
    }
    if (USA_FORM_STEPS.COMPANY_DOCUMENTATION === formStep) {
      data = convertFormToRequest.getDocumentsStage(fixedValues);
    }
    if (USA_FORM_STEPS.BANK_INFORMATION === formStep) {
      data = convertFormToRequest.getAccountStage(fixedValues);
    }
    if (USA_FORM_STEPS.FINAL_QUESTIONS === formStep) {
      data = convertFormToRequest.getQuestionsStage(fixedValues);
    }
    uploadDocuments(data, FORM_STEP_FIELDS[formStep] || '');
  };

  const buildStakeHolderAndSave = (values: IOnboardingFormData) => {
    const {
      incorporation,
      date,
      isLastStep,
      phoneNumber,
      postCode,
      postCodeId,
      ...rest
    } = values;
    setIsLast(isLastStep);
    let fixedValues: IUploadDocumentsOnboarding = {
      ...rest,
      postCode: postCode || postCodeId,
      phoneNumberEnterprise: phoneNumber || '',
    } as unknown as IUploadDocumentsOnboarding;
    if (isLastStep) {
      fixedValues = { ...fixedValues, completed: true };
    }
    uploadDocuments(fixedValues);
  };

  useEffect(() => {
    if (onboardingData && isLast) {
      setFormStep(USA_FORM_STEPS.ONBOARDING_CONFIRMATION);
      uploadCompleted();
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
    if (onboardingData && !isLast) {
      uploadCompleted();
      nextFormStep();
    }
  }, [onboardingData, isLast]);

  useEffect(() => {
    setFormValues({ countryOrigin });
  }, [countryOrigin]);

  if (!countryOrigin) return null;

  const renderBankComponent = () => {
    if (isFirstBankAccountControl) {
      return (
        <EfexFirstUsaBank
          onChangeOption={setIsFirstBankAccountControl}
          nextFormStep={buildDataAndSave}
          prevStep={prevFormStep}
        />
      );
    }
    return (
      <BankingInformation
        countryOrigin={countryOrigin}
        isDisabledEdit={isDisabledEdit}
        loading={loading}
        nextFormStep={buildDataAndSave}
        prevStep={prevFormStep}
        onChangeOption={setIsFirstBankAccountControl}
      />
    );
  };

  return (
    <Box className="pt-5 h-full pr-3">
      <>
        {formStep === USA_FORM_STEPS.COMPANY_DOCUMENTATION && (
          <CompanyDocumentation
            isDisabledEdit={isDisabledEdit}
            loading={loading}
            nextFormStep={buildDataAndSave}
          />
        )}
        {formStep === USA_FORM_STEPS.BANK_INFORMATION && renderBankComponent()}
        {formStep === USA_FORM_STEPS.IDENTIFICATION_OFFICIAL && (
          <StakeHolders
            isDisabledEdit={isDisabledEdit}
            loading={loading}
            nextFormStep={buildStakeHolderAndSave}
            prevStep={prevFormStep}
          />
        )}
        {formStep === USA_FORM_STEPS.FINAL_QUESTIONS && (
          <FinalQuestions
            isDisabledEdit={isDisabledEdit}
            nextFormStep={buildDataAndSave}
            prevStep={prevFormStep}
          />
        )}
        {formStep === USA_FORM_STEPS.ONBOARDING_CONFIRMATION && (
          <OnboardingConfirmation />
        )}
        {error ? (
          <Alert severity="error" className="my-4">
            {t('errorRetryMessage')}
          </Alert>
        ) : null}
      </>
    </Box>
  );
};

export default OnboardingForm;
