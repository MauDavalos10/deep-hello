import { Countries } from '@constants/enums';
import ProtectedRoute from '@efex-components/protectedRoutes/ProtectedRoutes';
import mixpanelSvc from '@efex-services/mixpanel/mixpanelSvc';
import { Grid } from '@mui/material';
import { selectProfileData } from '@pages/profile/store/selectors';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthInitializer from '@/modules/auth/AuthInitializer';
import SideBar from './components/SideBar';
import { ONBOARDING_MEXICO_FORM_STEPS } from './constants';
import { FormProvider } from './context';
import OnboardingForm from './steps';
import LangSelector from '@/components/navbar/lang';

const MexicoOnboarding = () => {
  const navigate = useNavigate();
  const userProfile = useSelector(selectProfileData);
  const { isKyc, isFullRegister } = userProfile || {};
  const [formStep, setFormStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});

  const countryOrigin = useMemo(
    () => userProfile?.company.country,
    [userProfile?.company.country]
  );

  const entityType = useMemo(
    () => userProfile?.userType || 'PERSON',
    [userProfile?.userType]
  );

  const sendMixpanelEvent = () => {
    mixpanelSvc.track('Onboarding step', {
      step: formStep + 1,
      userType: entityType,
    });
  };

  const isCompany = entityType === 'COMPANY';

  const stepsCompany = useMemo(
    () => [
      t('onbDocuments'),
      t('onbCompanyDocumentation'),
      t('onbBankInformation'),
      t('onbStakeHolders'),
    ],
    []
  );

  const stepsPerson = useMemo(
    () => [t('regGeneralInformation'), t('onbBankInformation')],
    []
  );

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[formStep] = true;
    setCompleted(newCompleted);
    sendMixpanelEvent();
  };

  useEffect(() => {
    sendMixpanelEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isKyc) {
      if (isCompany) {
        setCompleted({
          [ONBOARDING_MEXICO_FORM_STEPS.DOCUMENTATIONS]: true,
          [ONBOARDING_MEXICO_FORM_STEPS.COMPANY_DOCUMENTATION]: true,
          [ONBOARDING_MEXICO_FORM_STEPS.BANK_INFORMATION]: true,
        });
      } else {
        setCompleted({
          [ONBOARDING_MEXICO_FORM_STEPS.COMPANY_DOCUMENTATION]: true,
          [ONBOARDING_MEXICO_FORM_STEPS.BANK_INFORMATION]: true,
        });
      }
      if (countryOrigin !== Countries.MX) {
        setFormStep(ONBOARDING_MEXICO_FORM_STEPS.ONBOARDING_CONFIRMATION);
      }
    }
  }, [isKyc, isFullRegister, navigate, isCompany, countryOrigin]);

  return (
    <ProtectedRoute>
      <AuthInitializer>
        <Grid
          container
          spacing={2}
          sx={{ flexWrap: 'wrap-reverse' }}
          className="min-h-screen"
        >
          <Grid item xs={12} md={3}>
            <SideBar
              currentStep={formStep}
              steps={isCompany ? stepsCompany : stepsPerson}
              isKyc={isKyc}
              setFormStep={setFormStep}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <div className="absolute top-0 right-0 p-2 z-50">
              <LangSelector />
            </div>
            <FormProvider>
              <OnboardingForm
                entityType={entityType}
                countryOrigin={countryOrigin}
                formStep={
                  isKyc
                    ? ONBOARDING_MEXICO_FORM_STEPS.ONBOARDING_CONFIRMATION
                    : formStep
                }
                isDisabledEdit={false}
                uploadCompleted={handleComplete}
                setFormStep={setFormStep}
              />
            </FormProvider>
          </Grid>
        </Grid>
      </AuthInitializer>
    </ProtectedRoute>
  );
};

export default MexicoOnboarding;
