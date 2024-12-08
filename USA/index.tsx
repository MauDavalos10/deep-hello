import ProtectedRoute from '@efex-components/protectedRoutes/ProtectedRoutes';
import mixpanelSvc from '@efex-services/mixpanel/mixpanelSvc';
import { Grid } from '@mui/material';
import { selectProfileData } from '@pages/profile/store/selectors';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthInitializer from '@/modules/auth/AuthInitializer';
import SideBar from './components/SideBar';
import { USA_FORM_STEPS } from './constants';
import { FormProvider } from './context';
import OnboardingForm from './steps';
import LangSelector from '@/components/navbar/lang';

const UsaOnboarding = () => {
  const userProfile = useSelector(selectProfileData);
  const { isKyc } = userProfile || {};
  const [formStep, setFormStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});

  const countryOrigin = useMemo(
    () => userProfile?.company.country,
    [userProfile?.company.country]
  );

  const sendMixpanelEvent = () => {
    mixpanelSvc.track('Onboarding step', {
      step: formStep + 1,
      userType: 'COMPANY',
    });
  };

  const stepsCompany = useMemo(
    () => [
      t('onbCompanyDocumentation'),
      t('onbBankInformation'),
      t('onbStakeHolders'),
      t('onbFinalQuestions'),
    ],
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
      setCompleted({
        [USA_FORM_STEPS.COMPANY_DOCUMENTATION]: true,
        [USA_FORM_STEPS.BANK_INFORMATION]: true,
        [USA_FORM_STEPS.IDENTIFICATION_OFFICIAL]: true,
        [USA_FORM_STEPS.FINAL_QUESTIONS]: true,
      });
      setFormStep(USA_FORM_STEPS.ONBOARDING_CONFIRMATION);
    }
  }, [isKyc]);

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
            <div className="absolute top-0 right-0 p-2 z-50">
              <LangSelector />
            </div>
            <SideBar
              currentStep={formStep}
              steps={stepsCompany}
              isKyc={isKyc}
              setFormStep={setFormStep}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <FormProvider>
              <OnboardingForm
                countryOrigin={countryOrigin}
                formStep={
                  isKyc ? USA_FORM_STEPS.ONBOARDING_CONFIRMATION : formStep
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

export default UsaOnboarding;
