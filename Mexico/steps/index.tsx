/* eslint-disable react-hooks/exhaustive-deps */
import { Country } from '@configs/language';
import { Countries } from '@constants/enums';
import { Alert, Box } from '@mui/material';
import { selectProfileData } from '@pages/profile/store/selectors';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IUserType } from '../../../../services/auth/types';
import { IOnboardingFormData } from '../../../../services/client/types';
import { ONBOARDING_MEXICO_FORM_STEPS } from '../constants';
import { useFormData } from '../context';
import ConvertMxOnboarding from '../services/ConvertMexicoOnboarding';
import { RawDataAccount, RawDataDocuments } from '../types';
import BankingInformation from './BankingInformation';
import CompanyDocumentation from './CompanyDocumentation';
import OnboardingConfirmation from './OnboardingConfirmation';
import PersonBankingInformation from './PersonBankingInformation';
import PersonForm from './PersonForm';
import StakeHolders from './StakeHolders';
import KycMxDocuments from './components/KycMxDocuments';
import { FORM_STEP_FIELDS } from '../constants/stages';

interface IOnboardingForm {
  entityType: IUserType;
  formStep: number;
  countryOrigin: Country | undefined;
  isDisabledEdit?: boolean;
  uploadCompleted: () => void;
  setFormStep: (step: number) => void;
}

const OnboardingForm = ({
  entityType,
  formStep,
  countryOrigin,
  isDisabledEdit = false,
  uploadCompleted,
  setFormStep,
}: IOnboardingForm) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const convertMxOnboarding = new ConvertMxOnboarding();
  const userProfile = useSelector(selectProfileData);
  const [isLast, setIsLast] = useState(false);
  const {
    error,
    loading,
    setFormValues,
    onboardingMexico,
    onboardingMx,
    onboardingMexicoData,
    getOnboardingMx,
  } = useFormData();

  const isCompany = entityType === 'COMPANY';

  const nextFormStep = () => setFormStep(formStep + 1);
  const prevFormStep = () => setFormStep(formStep - 1);

  const enterpriseId = useMemo(
    () => userProfile?.company?.enterpriseId,
    [userProfile]
  );

  const buildDataAndSave = (values: IOnboardingFormData) => {
    const { isLastStep } = values;
    const fixedFormStep = formStep + (entityType === 'PERSON' ? 1 : 0);
    setIsLast(isLastStep);
    let data;
    if (fixedFormStep === ONBOARDING_MEXICO_FORM_STEPS.BENEFICIAL_OWNERS) {
      setFormStep(ONBOARDING_MEXICO_FORM_STEPS.ONBOARDING_CONFIRMATION);
      data = {};
    }
    if (fixedFormStep === ONBOARDING_MEXICO_FORM_STEPS.BANK_INFORMATION) {
      data = convertMxOnboarding.getAccountStage(
        values as unknown as RawDataAccount,
        enterpriseId as unknown as number
      );
      if (entityType === 'PERSON') {
        const { currency, ...rest } = data;
        data = rest;
      }
    } else {
      data = convertMxOnboarding.getDocumentsStage(
        values as unknown as RawDataDocuments
      );
      if (entityType === 'PERSON') {
        const { phoneNumber, rfc, resourceStatementOption, website, ...rest } =
          data;
        data = rest;
      } else {
        const { citizenship, idType, idNumber, ...rest } = data;
        data = rest;
      }
    }
    onboardingMx(data, FORM_STEP_FIELDS[fixedFormStep]);
  };

  useEffect(() => {
    if (onboardingMexico && isLast) {
      setFormStep(ONBOARDING_MEXICO_FORM_STEPS.ONBOARDING_CONFIRMATION);
      uploadCompleted();
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
    if (onboardingMexico && !isLast) {
      uploadCompleted();
      nextFormStep();
      getOnboardingMx();
    }
  }, [onboardingMexico, isLast]);

  useEffect(() => {
    setFormValues({ countryOrigin });
  }, [countryOrigin]);

  useEffect(() => {
    if (countryOrigin === Countries.MX && !onboardingMexicoData) {
      getOnboardingMx();
    }
  }, [countryOrigin, onboardingMexicoData]);

  if (!countryOrigin) return null;

  return (
    <Box className="pt-5 h-full pr-3">
      <>
        {isCompany &&
          countryOrigin === Countries.MX &&
          formStep === ONBOARDING_MEXICO_FORM_STEPS.DOCUMENTATIONS && (
            <KycMxDocuments
              nextFormStep={() =>
                setFormStep(ONBOARDING_MEXICO_FORM_STEPS.COMPANY_DOCUMENTATION)
              }
            />
          )}
        {isCompany &&
          formStep === ONBOARDING_MEXICO_FORM_STEPS.COMPANY_DOCUMENTATION && (
            <CompanyDocumentation
              isDisabledEdit={isDisabledEdit}
              loading={loading}
              nextFormStep={buildDataAndSave}
            />
          )}
        {isCompany &&
          formStep === ONBOARDING_MEXICO_FORM_STEPS.BANK_INFORMATION && (
            <BankingInformation
              countryOrigin={countryOrigin}
              isDisabledEdit={isDisabledEdit}
              entityType={entityType}
              loading={loading}
              nextFormStep={buildDataAndSave}
              prevStep={prevFormStep}
            />
          )}
        {isCompany &&
          formStep === ONBOARDING_MEXICO_FORM_STEPS.BENEFICIAL_OWNERS && (
            <StakeHolders
              isDisabledEdit={isDisabledEdit}
              loading={loading}
              nextFormStep={buildDataAndSave}
              prevStep={prevFormStep}
            />
          )}
        {!isCompany &&
          formStep ===
            ONBOARDING_MEXICO_FORM_STEPS.COMPANY_DOCUMENTATION - 1 && (
            <PersonForm
              isDisabledEdit={isDisabledEdit}
              loading={loading}
              nextFormStep={buildDataAndSave}
            />
          )}
        {!isCompany &&
          formStep === ONBOARDING_MEXICO_FORM_STEPS.BANK_INFORMATION - 1 && (
            <PersonBankingInformation
              isDisabledEdit={isDisabledEdit}
              loading={loading}
              nextFormStep={buildDataAndSave}
              prevStep={prevFormStep}
            />
          )}
        {formStep === ONBOARDING_MEXICO_FORM_STEPS.ONBOARDING_CONFIRMATION && (
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
