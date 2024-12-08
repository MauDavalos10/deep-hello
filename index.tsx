import { Countries } from '@constants/enums';
import { selectProfileData } from '@pages/profile/store/selectors';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ColombiaOnboarding from './Colombia';
import MexicoOnboarding from './Mexico';
import UsaOnboarding from './USA';
import AuthInitializer from '@/modules/auth/AuthInitializer';
import SessionTimeout from '@/modules/SessionTimeout';

const Onboarding = () => {
  const userProfile = useSelector(selectProfileData);

  const countryOrigin = useMemo(
    () => userProfile?.company.country,
    [userProfile?.company.country]
  );

  return (
    <AuthInitializer>
      <SessionTimeout />
      {countryOrigin === Countries.MX ? <MexicoOnboarding /> : null}
      {countryOrigin === Countries.USA ? <UsaOnboarding /> : null}
      {countryOrigin === Countries.COL ? <ColombiaOnboarding /> : null}
    </AuthInitializer>
  );
};

export default Onboarding;
