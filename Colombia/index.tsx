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
import { COLOMBIA_ONBOARDING_STEPS } from './constants';
import { FormProvider } from './context';
import OnboardingForm from './steps';

const ColombiaOnboarding = () => {
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
        [COLOMBIA_ONBOARDING_STEPS.COMPANY_DOCUMENTATION]: true,
        [COLOMBIA_ONBOARDING_STEPS.BANK_INFORMATION]: true,
        [COLOMBIA_ONBOARDING_STEPS.STAKEHOLDERS]: true,
      });
      setFormStep(COLOMBIA_ONBOARDING_STEPS.ONBOARDING_CONFIRMATION);
    }
  }, [isKyc, isFullRegister, navigate, countryOrigin]);

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
                  isKyc
                    ? COLOMBIA_ONBOARDING_STEPS.ONBOARDING_CONFIRMATION
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

export default ColombiaOnboarding;
