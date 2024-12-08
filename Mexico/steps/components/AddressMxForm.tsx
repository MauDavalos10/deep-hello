import { onlyTextRegex } from '@constants/general';
import { Statement2 } from '@efex-services/client/types';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { icon_check_circle_green } from '@/assets';
import CompanySectorAutocomplete from './CompanySectorAutocomplete';
import PostalCodeAutocomplete from './PostalCodeAutocomplete';

export type FormData = {
  website?: string;
  phoneNumber: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postCode?: number;
  taxId: string;
  incorporation?: DateTime;
  constitutionFile?: File | undefined;
  certificateFile?: File | undefined;
  satFile?: File | undefined;
  neighborhood?: string;
  businessSectorId?: number;
  legalRepresentativeStatament?: boolean;
  externalNumber?: string;
  internalNumber?: string;
};

interface AddressMxFormProps {
  register: UseFormRegister<FormData>;
  FieldsWatched: any;
  errors: any;
  control: Control<FormData, any>;
  setValue: UseFormSetValue<FormData>;
  data: any;
  isPersonForm?: boolean;
  showCompanySectorError?: boolean;
}

const AddressMxForm = ({
  register,
  FieldsWatched,
  setValue,
  errors,
  control,
  data,
  isPersonForm = false,
  showCompanySectorError = false,
}: AddressMxFormProps) => {
  const { t } = useTranslation();
  const [postalCodeData, setPostalCodeData] = useState<IPostalCode | null>();
  const [businessSectorId, setBusinessSectorId] =
    useState<ICompanySector | null>();
  const handleSelectPostalCode = (postalCode?: IPostalCode) => {
    setPostalCodeData(postalCode);
  };

  useEffect(() => {
    if (postalCodeData) {
      setValue('neighborhood', postalCodeData.neighborhood.description);
      setValue('city', postalCodeData.federalEntity.description);
      setValue('state', postalCodeData.municipality.description);
      setValue('postCode', postalCodeData.id);
    }
  }, [postalCodeData, setValue]);

  useEffect(() => {
    if (businessSectorId) {
      setValue('businessSectorId', businessSectorId.id);
    }
  }, [businessSectorId, setValue]);

  useEffect(() => {
    if (data && data.postData && data.postData.postalCode) {
      setPostalCodeData(data.postData);
    }
    if (data && data.companySector && data.companySector.economicActivityKey) {
      setBusinessSectorId(data.companySector);
    }
    if (data && data.statements && data.statements.length > 0) {
      setValue(
        'legalRepresentativeStatament',
        data.statements.find(
          (statement: Statement2) => statement.statement.id === 2
        ).value
      );
    }
  }, [data, setValue]);

  return (
    <>
      <Grid container className="!my-[15px]">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography variant="subtitle2">{t('regMxPost')}</Typography>
            <div className="flex w-full">
              <PostalCodeAutocomplete
                className="custom-textfield w-[90%]"
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
                className="custom-textfield w-[80%]"
                size="small"
                disabled
                placeholder="Colonia"
                {...register('neighborhood', {
                  required: true,
                })}
              />
              {FieldsWatched[4] && FieldsWatched[4].length > 0 && (
                <img
                  src={icon_check_circle_green}
                  alt=""
                  className="w-[25px] ml-[10px]"
                />
              )}
            </div>
            {errors && errors.city && errors.city.type === 'required' && (
              <p className="text-orange-600 text-xs mt-1">
                {t('defaultError')}
              </p>
            )}
            {errors && errors.city && errors.city.type === 'pattern' && (
              <p className="text-orange-600 text-xs mt-1">
                {t('onbOnlyTextError')}
              </p>
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Grid container className="!my-[15px]">
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">{t(`city`)}</Typography>
          <FormControl fullWidth>
            <div className="flex w-full">
              <TextField
                autoComplete="off"
                type="text"
                disabled
                className="custom-textfield w-[90%]"
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
              {FieldsWatched[4] && FieldsWatched[4].length > 0 && (
                <img
                  src={icon_check_circle_green}
                  alt=""
                  className="w-[25px] ml-[10px]"
                />
              )}
            </div>
            {errors && errors.city && errors.city.type === 'required' && (
              <p className="text-orange-600 text-xs mt-1">
                {t('defaultError')}
              </p>
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
                className="custom-textfield w-[80%]"
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
              {FieldsWatched[5] && FieldsWatched[5].length > 0 && (
                <img
                  src={icon_check_circle_green}
                  alt=""
                  className="w-[25px] ml-[10px]"
                />
              )}
            </div>
            {errors && errors.state && errors.state.type === 'required' && (
              <p className="text-orange-600 text-xs mt-1">
                {t('defaultError')}
              </p>
            )}
            {errors && errors.state && errors.state.type === 'pattern' && (
              <p className="text-orange-600 text-xs mt-1">
                {t('onbOnlyTextError')}
              </p>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl className="!mt-3" fullWidth>
            <Typography variant="subtitle2">{t('regMxSector')}</Typography>
            <div className="flex w-full">
              <CompanySectorAutocomplete
                className="custom-textfield w-[90%]"
                data={data}
                selectedValue={businessSectorId}
                showCompanySectorError={showCompanySectorError}
                onSelectCompanySector={setBusinessSectorId}
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
        {!isPersonForm ? (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="legalRepresentativeStatament"
                control={control}
                defaultValue={(data.statements as Statement2[])
                  ?.filter((statement) => statement.statement.id === 2)
                  .some((value) => value.value)}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label={t('regLegalRepresentativeStatament')}
                  />
                )}
              />
            </FormControl>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

export default AddressMxForm;
