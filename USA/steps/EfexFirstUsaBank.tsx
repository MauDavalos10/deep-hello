import Button from '@efex-components/common/Button';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormData } from '../context';
import { FormData } from '../types';

interface EfexFirstUsaBankProps {
  onChangeOption: (value: boolean) => void;
  nextFormStep: (data: any) => void;
  prevStep: () => void;
}

const EfexFirstUsaBank = ({
  onChangeOption,
  prevStep,
  nextFormStep,
}: EfexFirstUsaBankProps) => {
  const { t } = useTranslation();
  const { setFormValues, data } = useFormData();
  const [isSubmittingData, setIsSubmittingData] = useState<boolean>(false);

  const submitData = useCallback(() => {
    setIsSubmittingData(true);
    const fixedData: FormData = {
      ...data,
      accountNumber: '',
      accountType: '',
      routingNumber: '',
      bankCode: '',
      bankName: '',
      bankStatement: undefined,
      isLastStep: false,
      isFirstAccount: true,
    };
    setFormValues(fixedData);
    nextFormStep(fixedData);
  }, [data, setFormValues, nextFormStep]);

  return (
    <>
      <Typography variant="h4" className="!font-medium">
        {t('onbAboutYourBanking')}
      </Typography>
      <Typography variant="h5" className="!leading-10 !mt-[20px] !mb-[40px]">
        {t('onbAboutIsYourFirstBank')}
      </Typography>
      <Grid item xs={12} className="flex justify-center gap-10  max-w-[1000px]">
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
        >
          <ListItemButton
            disabled={isSubmittingData}
            onClick={() => onChangeOption(false)}
          >
            <ListItemIcon>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary={t('onbUserHaveBankAccount')} />
          </ListItemButton>
          <Divider variant="inset" component="li" />
          <ListItemButton
            disabled={isSubmittingData}
            onClick={() => {
              submitData();
            }}
          >
            <ListItemIcon>
              {isSubmittingData ? (
                <AutorenewIcon className="animate-spin" />
              ) : (
                <AccountBalanceWalletIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={t('onbUserDontHaveBankAccount')} />
          </ListItemButton>
        </List>
      </Grid>
      <Grid item xs={12} className="flex justify-start gap-10  max-w-[1000px]">
        <Button
          size="large"
          className="mt-2 text-[14px]"
          type="button"
          variant="secondary"
          onClick={prevStep}
        >
          {t('backBtn')}
        </Button>
      </Grid>
    </>
  );
};

export default EfexFirstUsaBank;
