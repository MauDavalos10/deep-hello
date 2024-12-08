/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import { Countries } from '@constants/enums';
import Button from '@efex-components/common/Button';
import TaxIdInput from '@efex-components/EfexDS/Inputs/TaxIdInput/TaxIdInput';
import {
  TaxIdInputPropsType,
  TaxIdValidation,
} from '@efex-components/EfexDS/Inputs/TaxIdInput/types';
import { PhoneInput } from '@efex-components/phone/PhoneInput';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Alert, FormControl, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import BussinesNature from '@pages/onboarding/components/BussinesNature/BussinesNature';
import CompanyOperation from '@pages/onboarding/components/CompanyOperation/CompanyOperation';
import PhoneInputService from '@utils/phoneInput.service';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { icon_check_circle_green } from '../../../../assets';
import { onlyNumbersRegex, onlyTextRegex, websiteRegex } from '../constants';
import { useFormData } from '../context';

interface ICompanyDocumentation {
  isDisabledEdit?: boolean;
  loading?: boolean;
  nextFormStep: (data: any) => void;
}

type FormularyData = {
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
  businessSectorId?: string;
  resourceStatament?: boolean;
  resourceStatementOption?: string;
  legalRepresentativeStatament?: boolean;
};

const CompanyDocumentation = ({
  isDisabledEdit = false,
  loading,
  nextFormStep,
}: ICompanyDocumentation) => {
  const { t } = useTranslation();
  const phoneService = new PhoneInputService();
  const { setFormValues, data } = useFormData();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm<FormularyData>();

  const FieldsWatched = useWatch({
    control,
    name: [
      'website',
      'phoneNumber',
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'taxId',
      'incorporation',
      'postCode',
      'neighborhood',
    ],
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormValues({ ...data, ...values, isLastStep: false });
    nextFormStep({ ...data, ...values, isLastStep: false });
  });

  useEffect(() => {
    if (data.website) {
      setValue('website', data.website);
    }
    if (data.phoneNumber) {
      setValue('phoneNumber', data.phoneNumber);
    }
    if (data.addressLine1) {
      setValue('addressLine1', data.addressLine1);
    }
    if (data.addressLine2) {
      setValue('addressLine2', data.addressLine2);
    }
    if (data.city) {
      setValue('city', data.city);
    }
    if (data.state) {
      setValue('state', data.state);
    }
    if (data.taxId) {
      setValue('taxId', data.taxId);
    }
    if (data.incorporation) {
      setValue('incorporation', data.incorporation);
    }
    if (data.postCode) {
      setValue('postCode', data.postCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <Typography variant="h4" className="!font-medium">
        {t('onbCompanyDocumentation')}
      </Typography>

      <form onSubmit={onSubmit} autoComplete="off">
        <Grid rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">{t(`onbWebsiteUSA`)}</Typography>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="text"
                  className="custom-textfield w-[90%]"
                  size="small"
                  error={!!errors?.website}
                  placeholder={t(`onbWebsiteUSA`) as string}
                  {...register('website', {
                    required: true,
                    pattern: {
                      value: websiteRegex,
                      message: 'websiteError',
                    },
                  })}
                />
                {FieldsWatched[0] && FieldsWatched[0].length > 0 && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[10px]"
                  />
                )}
              </div>
              {errors &&
                errors.website &&
                errors.website.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
              {errors &&
                errors.website &&
                errors.website.type === 'pattern' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t(errors.website.message ?? 'defaultError')}
                  </p>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="phoneNumber"
                rules={{
                  required: true,
                  validate: (val) => phoneService.validatePhoneNumber(val),
                }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="flex w-full">
                    <PhoneInput
                      value={value}
                      onChange={onChange}
                      error={!!errors.phoneNumber}
                      label={`${t(`onbCompanyPhoneNumberUSA`)}`}
                      className="custom-textfield w-[90%]"
                      defaultCountry="CO"
                      defaultCountriesArray={phoneService.getBaseCountry('ALL')}
                    />
                    {FieldsWatched[1] && FieldsWatched[1].length > 5 && (
                      <img
                        src={icon_check_circle_green}
                        alt=""
                        className="w-[25px] ml-[10px]"
                      />
                    )}
                  </div>
                )}
              />
              {errors.phoneNumber && errors.phoneNumber.type === 'required' && (
                <p className="text-orange-600 text-xs">
                  {t('regPhoneValidation')}
                </p>
              )}
              {errors.phoneNumber && errors.phoneNumber.type === 'validate' && (
                <p className="text-orange-600 text-xs">
                  {t('regPhoneIsNotValid')}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                {t(`onbCompanyAddressUSA`)}
              </Typography>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="text"
                  className="custom-textfield w-[90%]"
                  size="small"
                  placeholder={t(`onbStakeAddress1`) as string}
                  {...register('addressLine1', { required: true })}
                />
                {FieldsWatched[2] && FieldsWatched[2].length > 0 && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[10px]"
                  />
                )}
              </div>
              {errors && errors.addressLine1 && (
                <p className="text-orange-600 text-xs mt-1">
                  {t('defaultError')}
                </p>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <div className="flex w-full">
                <TextField
                  autoComplete="off"
                  type="text"
                  className="custom-textfield w-[90%]"
                  size="small"
                  placeholder={t(`onbStakeAddress2`) as string}
                  {...register('addressLine2')}
                />
                {FieldsWatched[3] && FieldsWatched[3].length > 0 && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[10px]"
                  />
                )}
              </div>
            </FormControl>
          </Grid>
          <Grid container className="!my-[15px]">
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">{t(`city`)}</Typography>
              <FormControl fullWidth>
                <div className="flex w-full">
                  <TextField
                    autoComplete="off"
                    type="text"
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
                    className="custom-textfield w-[80%]"
                    size="small"
                    placeholder={t(`state`) as string}
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
            <Grid item xs={12} md={6} className="!mt-[15px]">
              <Typography variant="subtitle2">{t(`postCode`)}</Typography>
              <FormControl fullWidth>
                <div className="flex w-full">
                  <TextField
                    autoComplete="off"
                    type="number"
                    className="custom-textfield w-[90%]"
                    size="small"
                    placeholder={t(`postCode`) as string}
                    {...register('postCode', {
                      required: true,
                      pattern: {
                        value: onlyNumbersRegex,
                        message: '',
                      },
                    })}
                  />
                  {FieldsWatched[8] && (
                    <img
                      src={icon_check_circle_green}
                      alt=""
                      className="w-[25px] ml-[10px]"
                    />
                  )}
                </div>
                {errors &&
                  errors.postCode &&
                  errors.postCode.type === 'required' && (
                    <p className="text-orange-600 text-xs mt-1">
                      {t('defaultError')}
                    </p>
                  )}
                {errors &&
                  errors.postCode &&
                  errors.postCode.type === 'pattern' && (
                    <p className="text-orange-600 text-xs mt-1">
                      {t('onbOnlyNumberError')}
                    </p>
                  )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TaxIdInput
              title="onbTaxIdCOL"
              validationType={TaxIdValidation.COLOMBIA}
              errors={errors}
              countryOrigin={Countries.COL}
              register={register as unknown as TaxIdInputPropsType['register']}
              setValue={setValue as unknown as TaxIdInputPropsType['setValue']}
              customPlaceholder="XXXXXXXXXXX-X"
              helperText="XXXXXXXXXXX-X"
              textFieldClassName="custom-textfield w-[90%]"
              errorClassName="text-xs mt-1"
            />
          </Grid>
          <Grid item xs={12} className="!my-[15px]">
            <FormControl fullWidth>
              <Typography variant="subtitle2">
                {t(`onbIncorporation`)}
              </Typography>
              <div className="flex w-full">
                <Controller
                  name="incorporation"
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                      <DatePicker
                        {...field}
                        disableFuture
                        defaultValue={data?.incorporation || DateTime.now()}
                        className={clsx(
                          'w-full ',
                          FieldsWatched[7] ? '!mr-[0px]' : '!mr-[55px]',
                          'custom-textfield w-[90%]'
                        )}
                        onChange={(value) => {
                          if (!value) return;
                          field.onChange(value);
                        }}
                        slotProps={{
                          // eslint-disable-next-line react/no-unstable-nested-components
                          textField: (params) => (
                            <TextField {...params} size="small" fullWidth />
                          ),
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
                {FieldsWatched[7] && FieldsWatched[7] instanceof DateTime && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[10px] mr-[20px]"
                  />
                )}
              </div>
              {errors && errors.incorporation && (
                <p className="text-orange-600 text-xs mt-1">
                  {t('defaultError')}
                </p>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <BussinesNature />
          <CompanyOperation />
        </Grid>
        <Grid item xs={12} className="flex justify-center gap-10">
          {!isDisabledEdit ? (
            <Button
              size="large"
              className="mt-2 bg-[#006BF8] border-[#006BF8] text-[14px]"
              type="submit"
              disabled={loading}
              icon={
                loading ? <AutorenewIcon className="animate-spin" /> : undefined
              }
            >
              {t('continue')}
            </Button>
          ) : (
            <Alert severity="info">{t('kybStepTwoTitle')}</Alert>
          )}
        </Grid>
      </form>
    </>
  );
};

export default CompanyDocumentation;
