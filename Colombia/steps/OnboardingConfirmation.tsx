import { Countries } from '@constants/enums';
import Button from '@efex-components/common/Button';
import mixpanelSvc from '@efex-services/mixpanel/mixpanelSvc';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { kybWaiting } from '../../../../assets';
import { useFormData } from '../context';

const OnboardingConfirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useFormData();
  const { countryOrigin } = data;

  const completeOnboarding = () => {
    mixpanelSvc.track('Onboarding Completed');
    navigate('/dashboard');
    navigate(0);
  };

  return (
    <div className="max-w-[900px] w-[90%] mx-auto text-center">
      <img src={kybWaiting} className="w-[200px] h-[200px]" alt="kyb-waiting" />
      <br />
      <Typography variant="h5">{t('kybStepTwoTitle')}</Typography>
      <Typography className="py-3">
        {t(
          countryOrigin === Countries.USA
            ? 'kybStepTwoDescriptionOneUSA'
            : 'kybStepTwoDescriptionOne'
        )}{' '}
        <strong>{t('kybStepTwoDescriptionTwo')}</strong>
      </Typography>
      <Typography>
        {t('kybStepTwoFooterOne')} <span>{t('kybStepTwoFooterTwo')}</span>{' '}
        {t('kybStepTwoFooterThird')}{' '}
        <a
          className="underline text-sky-600 hover:text-sky-800"
          href="mailto:sales@efexpay.com"
        >
          sales@efexpay.com
        </a>
      </Typography>
      <br />
      <Button
        className="min-w-[100px]"
        type="button"
        onClick={completeOnboarding}
      >
        {t('goToDashboard')}
      </Button>
    </div>
  );
};

export default OnboardingConfirmation;
