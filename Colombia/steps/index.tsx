/* eslint-disable react-hooks/exhaustive-deps */
import { Country } from '@configs/language';
import { Alert, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { COLOMBIA_ONBOARDING_STEPS } from '../constants';
import { useFormData } from '../context';
import BankingInformation from './BankingInformation';
import CompanyDocumentation from './CompanyDocumentation';
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
  const navigate = useNavigate();
  const [isLast, setIsLast] = useState(false);
  const { error, loading, onboardingData, setFormValues, uploadDocuments } =
    useFormData();

  const nextFormStep = () => setFormStep(formStep + 1);
  const prevFormStep = () => setFormStep(formStep - 1);

  const buildDataAndSave = (values: any) => {
    const {
      accountNumber,
      bankName,
      accountType,
      addressLine1,
      addressLine2,
      city,
      taxId,
      incorporation,
      phoneNumber,
      postCode,
      state,
      website,
      isLastStep,
    } = values;
    setIsLast(isLastStep);
    const documentsStage = {
      addressLine1,
      addressLine2,
      city,
      idNumber: taxId,
      incorporation: incorporation?.toISODate() || '',
      phoneNumber,
      postCode,
      state,
      website,
    };
    const bankStage = {
      accountNumber,
      bankName,
      accountType,
    };
    const uploadData = (): object => {
      if (formStep === COLOMBIA_ONBOARDING_STEPS.COMPANY_DOCUMENTATION) {
        return documentsStage;
      }
      if (formStep === COLOMBIA_ONBOARDING_STEPS.BANK_INFORMATION) {
        return bankStage;
      }
      return {};
    };
    uploadDocuments(uploadData(), FORM_STEP_FIELDS[formStep]);
  };

  useEffect(() => {
    if (onboardingData && isLast) {
      setFormStep(COLOMBIA_ONBOARDING_STEPS.ONBOARDING_CONFIRMATION);
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

  return (
    <Box className="pt-5 h-full pr-3">
      <>
        {formStep === COLOMBIA_ONBOARDING_STEPS.COMPANY_DOCUMENTATION && (
          <CompanyDocumentation
            isDisabledEdit={isDisabledEdit}
            loading={loading}
            nextFormStep={buildDataAndSave}
          />
        )}
        {formStep === COLOMBIA_ONBOARDING_STEPS.BANK_INFORMATION && (
          <BankingInformation
            countryOrigin={countryOrigin}
            isDisabledEdit={isDisabledEdit}
            loading={loading}
            nextFormStep={buildDataAndSave}
            prevStep={prevFormStep}
          />
        )}
        {formStep === COLOMBIA_ONBOARDING_STEPS.STAKEHOLDERS && (
          <StakeHolders
            isDisabledEdit={isDisabledEdit}
            loading={loading}
            nextFormStep={buildDataAndSave}
            prevStep={prevFormStep}
          />
        )}
        {formStep === COLOMBIA_ONBOARDING_STEPS.ONBOARDING_CONFIRMATION && (
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
