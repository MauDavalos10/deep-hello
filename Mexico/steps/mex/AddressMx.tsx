import { onlyTextRegex } from '@constants/general';
import onboardingSvc from '@efex-services/onboarding';
import { FormControl, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useApiCall } from 'use-api-call';
import { icon_check_circle_green } from '@/assets';
import { MexicoStakeHoldersFormData } from '../../types/stakeholders.type';
import PostalCodeAutocomplete from '../components/PostalCodeAutocomplete';

interface AddressMxProps {
  errors: any;
  control: Control<MexicoStakeHoldersFormData, any>;
  data: any;
  register: UseFormRegister<MexicoStakeHoldersFormData>;
  setValue: UseFormSetValue<MexicoStakeHoldersFormData>;
}

const AddressMx = ({ register, setValue, errors, data }: AddressMxProps) => {
  const { t } = useTranslation();
  const [postalCodeData, setPostalCodeData] = useState<IPostalCode | null>();

  const { data: postalCodesData, invoke: getPostalCodes } = useApiCall(
    (search: string) =>
      onboardingSvc.getPostalCode({
        searchCriteria: search,
      })
  );

  const handleSelectPostalCode = (postalCode?: IPostalCode) => {
    setPostalCodeData(postalCode);
  };

  useEffect(() => {
    if (postalCodeData) {
      setValue('neighborhood', postalCodeData.neighborhood.description);
      setValue('city', postalCodeData.federalEntity.description);
      setValue('state', postalCodeData.municipality.description);
      setValue('postCode', postalCodeData.postalCode);
      setValue('postCodeId', postalCodeData.id);
    }
  }, [postalCodeData, setValue]);

  useEffect(() => {
    if (data && data.postCodeId && !postalCodeData) {
      getPostalCodes(data.postCodeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, postalCodeData]);

  useEffect(() => {
    if (postalCodesData) {
      setPostalCodeData(postalCodesData[0]);
    }
  }, [postalCodesData]);

  return (
    <>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <Typography variant="subtitle2">{t('regMxPost')}</Typography>
          <div className="flex w-full">
            <PostalCodeAutocomplete
              className="custom-textfield w-full"
              onSelectPostalCode={handleSelectPostalCode}
              defaultPostCode={postalCodeData?.postalCode}
            />
            {postalCodeData?.id && (
              <img
                src={icon_check_circle_green}
                alt=""
                className="w-[25px] ml-[10px]"
              />
            )}
          </div>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2">{t('regMxColony')}</Typography>
        <FormControl fullWidth>
          <div className="flex w-full">
            <TextField
              autoComplete="off"
              type="text"
              error={!!errors.neighborhood}
              className="custom-textfield w-full"
              size="small"
              disabled
              placeholder="Colonia"
              {...register('neighborhood', {
                required: true,
              })}
            />
          </div>
          {errors && errors.city && errors.city.type === 'required' && (
            <p className="text-orange-600 text-xs mt-1">{t('defaultError')}</p>
          )}
          {errors && errors.city && errors.city.type === 'pattern' && (
            <p className="text-orange-600 text-xs mt-1">
              {t('onbOnlyTextError')}
            </p>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2">{t(`city`)}</Typography>
        <FormControl fullWidth>
          <div className="flex w-full">
            <TextField
              autoComplete="off"
              type="text"
              disabled
              className="custom-textfield w-full"
              size="small"
              placeholder={t(`city`) as string}
              {...register('city', {
                required: true,
                pattern: {
                  value: onlyTextRegex,
                  message: '',
                },
              })}
            />
          </div>
          {errors && errors.city && errors.city.type === 'required' && (
            <p className="text-orange-600 text-xs mt-1">{t('defaultError')}</p>
          )}
          {errors && errors.city && errors.city.type === 'pattern' && (
            <p className="text-orange-600 text-xs mt-1">
              {t('onbOnlyTextError')}
            </p>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2">{t(`state`)}</Typography>
        <FormControl fullWidth>
          <div className="flex w-full">
            <TextField
              autoComplete="off"
              type="text"
              disabled
              className="custom-textfield w-full"
              size="small"
              placeholder={t(`state`) as string}
              aria-readonly
              {...register('state', {
                pattern: {
                  value: onlyTextRegex,
                  message: '',
                },
              })}
            />
          </div>
          {errors && errors.state && errors.state.type === 'required' && (
            <p className="text-orange-600 text-xs mt-1">{t('defaultError')}</p>
          )}
          {errors && errors.state && errors.state.type === 'pattern' && (
            <p className="text-orange-600 text-xs mt-1">
              {t('onbOnlyTextError')}
            </p>
          )}
        </FormControl>
      </Grid>
    </>
  );
};

export default AddressMx;
