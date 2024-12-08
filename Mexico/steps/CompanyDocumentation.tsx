import { Countries } from '@constants/enums';
import Button from '@efex-components/common/Button';
import TaxIdInput from '@efex-components/EfexDS/Inputs/TaxIdInput/TaxIdInput';
import { TaxIdInputPropsType } from '@efex-components/EfexDS/Inputs/TaxIdInput/types';
import { PhoneInput } from '@efex-components/phone/PhoneInput';
import useBoolean from '@main-hooks/useBoolean';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Alert, FormControl, Grid, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import PhoneInputService from '@utils/phoneInput.service';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { icon_check_circle_green } from '../../../../assets';
import { addressMaxLength, websiteRegex } from '../constants';
import { useFormData } from '../context';
import AddressMxForm, { FormData } from './components/AddressMxForm';

interface ICompanyDocumentation {
  isDisabledEdit?: boolean;
  loading?: boolean;
  nextFormStep: (data: any) => void;
}

const CompanyDocumentation = ({
  isDisabledEdit = false,
  loading,
  nextFormStep,
}: ICompanyDocumentation) => {
  const { t } = useTranslation();
  const phoneService = new PhoneInputService();
  const { setFormValues, data } = useFormData();
  const [showSectorError, { setTrue: showError, setFalse: hideError }] =
    useBoolean(false);

  const { countryOrigin } = data;

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm<FormData>();

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
    if (!values.businessSectorId) {
      showError();
      return;
    }
    hideError();
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
    if (data.externalNumber) {
      setValue('externalNumber', data.externalNumber);
    }
    if (data.internalNumber) {
      setValue('internalNumber', data.internalNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <Typography variant="h4" className="!font-medium">
        {t('onbCompanyDocumentationMex')}
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
                      defaultCountry={(countryOrigin as string)
                        .slice(0, 2)
                        .toLowerCase()}
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
          <AddressMxForm
            errors={errors}
            control={control}
            FieldsWatched={FieldsWatched}
            register={register}
            setValue={setValue}
            data={data}
            showCompanySectorError={showSectorError}
          />

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
                  error={!!errors?.addressLine1}
                  placeholder={t(`mxAddressLine1`) as string}
                  {...register('addressLine1', {
                    required: true,
                    maxLength: addressMaxLength,
                  })}
                />
                {FieldsWatched[2] && FieldsWatched[2].length > 0 && (
                  <img
                    src={icon_check_circle_green}
                    alt=""
                    className="w-[25px] ml-[10px]"
                  />
                )}
              </div>
              {errors?.addressLine1 &&
                errors?.addressLine1.type === 'required' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('defaultError')}
                  </p>
                )}
              {errors?.addressLine1 &&
                errors?.addressLine1.type === 'maxLength' && (
                  <p className="text-orange-600 text-xs mt-1">
                    {t('MaxLengthCharacters', { max: addressMaxLength })}
                  </p>
                )}
            </FormControl>
          </Grid>
          <Grid container className="!w-[90%]">
            <Grid item xs={12} md={6} className="!my-[15px]">
              <FormControl fullWidth>
                <Typography variant="subtitle2">
                  {t(`externalNumber`)}
                </Typography>
                <div className="flex w-full">
                  <TextField
                    fullWidth
                    autoComplete="off"
                    type="text"
                    size="small"
                    error={!!errors?.externalNumber}
                    placeholder="3A"
                    {...register('externalNumber', {
                      required: true,
                      maxLength: addressMaxLength,
                    })}
                  />
                </div>
                {errors?.externalNumber &&
                  errors?.externalNumber.type === 'required' && (
                    <p className="text-orange-600 text-xs mt-1">
                      {t('defaultError')}
                    </p>
                  )}
                {errors?.externalNumber &&
                  errors?.externalNumber.type === 'maxLength' && (
                    <p className="text-orange-600 text-xs mt-1">
                      {t('MaxLengthCharacters', { max: addressMaxLength })}
                    </p>
                  )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} className="!my-[15px] !pl-4">
              <FormControl fullWidth>
                <Typography variant="subtitle2">
                  {t(`internalNumber`)}
                </Typography>
                <div className="flex w-full">
                  <TextField
                    fullWidth
                    autoComplete="off"
                    type="text"
                    size="small"
                    error={!!errors?.internalNumber}
                    placeholder="Depto 1"
                    {...register('internalNumber', {
                      maxLength: addressMaxLength,
                    })}
                  />
                </div>
                {errors?.internalNumber &&
                  errors?.internalNumber.type === 'required' && (
                    <p className="text-orange-600 text-xs mt-1">
                      {t('defaultError')}
                    </p>
                  )}
                {errors?.internalNumber &&
                  errors?.internalNumber.type === 'maxLength' && (
                    <p className="text-orange-600 text-xs mt-1">
                      {t('MaxLengthCharacters', { max: addressMaxLength })}
                    </p>
                  )}
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TaxIdInput
              title="ccRFC"
              customPlaceholder="ABCD010203XYZ"
              errors={errors}
              countryOrigin={Countries.MX}
              register={register as unknown as TaxIdInputPropsType['register']}
              setValue={setValue as unknown as TaxIdInputPropsType['setValue']}
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
                        defaultValue={data?.incorporation}
                        className={clsx(
                          'w-full ',
                          FieldsWatched[7] ? '!mr-[0px]' : '!mr-[55px]',
                          ' w-[90%]',
                          !!errors?.incorporation && '!border-red-500'
                        )}
                        onChange={(value) => {
                          if (!value) return;
                          field.onChange(value);
                        }}
                        slotProps={{
                          // eslint-disable-next-line react/no-unstable-nested-components
                          textField: {
                            size: 'small',
                            error: !!errors?.incorporation,
                            fullWidth: true,
                          },
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
