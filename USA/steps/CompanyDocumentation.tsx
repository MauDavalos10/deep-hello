/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import { Countries } from '@constants/enums';
import Button from '@efex-components/common/Button';
import UploadFileInput from '@efex-components/common/Form/UploadFileInput';
import TaxIdInput from '@efex-components/EfexDS/Inputs/TaxIdInput/TaxIdInput';
import {
  TaxIdInputPropsType,
  TaxIdValidation,
} from '@efex-components/EfexDS/Inputs/TaxIdInput/types';
import { PhoneInput } from '@efex-components/phone/PhoneInput';
import documentsSvc, {
  IOnboardingDocuments,
} from '@efex-services/documents/documentsSvc';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Alert,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { selectBusiness } from '@pages/profile/store/selectors';
import PhoneInputService from '@utils/phoneInput.service';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import { icon_check_circle_green } from '../../../../assets';
import NewCompanyDocuments from '../components/NewCompanyDocuments/NewCompanyDocuments';
import { onlyNumbersRegex, onlyTextRegex, websiteRegex } from '../constants';
import { useFormData } from '../context';

interface ICompanyDocumentation {
  isDisabledEdit?: boolean;
  loading?: boolean;
  nextFormStep: (data: any) => void;
}

export type FormularyDataUSA = {
  website?: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city?: string;
  state?: string;
  postCode?: number;
  taxId: string;
  taxIdType: 'EIN' | 'SSN';
  incorporation?: DateTime;
  constitutionFile?: File | undefined;
  certificateFile?: File | undefined;
  satFile?: File | undefined;
  neighborhood?: string;
  businessSectorId?: string;
  resourceStatament?: boolean;
  resourceStatementOption?: string;
  legalRepresentativeStatament?: boolean;
  companyDocumentType?: 'passport' | 'personalId' | 'driversLicence';
  industryCode?: string;
  effectiveAt?: string;
  expiredAt?: string;
  number?: string;
  gender?: string;
};

const CompanyDocumentation = ({
  isDisabledEdit = false,
  loading,
  nextFormStep,
}: ICompanyDocumentation) => {
  const { t } = useTranslation();
  const company = useSelector(selectBusiness);
  const phoneService = new PhoneInputService();
  const { setFormValues, data } = useFormData();

  const {
    onboardingDocuments,
    getOnboardingDocuments,
  }: {
    onboardingDocuments: IOnboardingDocuments[];
    getOnboardingDocuments: () => void;
  } = useFormData();

  const {
    loading: loadingDocuments,
    data: uploadData,
    error: errorDocuments,
    invoke: uploadDocuments,
  } = useApiCall(
    ({
      currentDocuments,
      name,
    }: {
      currentDocuments: File[];
      name: OnboardingDocumentTypeIds;
    }) =>
      documentsSvc.uploadOnboardingDocument(
        company?.enterpriseId as unknown as number,
        {
          documentTypeId: OnboardingDocumentTypeIds[
            name
          ] as unknown as OnboardingDocumentTypeIds,
          totalDocuments: currentDocuments.length,
          documents: currentDocuments as unknown as FormData,
        }
      )
  );

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm<FormularyDataUSA>();

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
    ],
  });
  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length) {
      const filesArray: File[] = [];
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index <= files.length - 1; index++) {
        filesArray[index] = files.item(index) as File;
      }
      uploadDocuments({
        currentDocuments: filesArray,
        name: 'constitutionFile',
      });
    }
  };

  const validateUsaTaxId = (values: string): string => {
    if (values.includes('-')) {
      return values;
    }
    return `${values.slice(0, 2)}-${values.slice(2, values.length - 1)}`;
  };

  const onSubmit = handleSubmit(async (values) => {
    const fixedTax = validateUsaTaxId(values.taxId);
    setFormValues({ ...data, ...values, taxId: fixedTax, isLastStep: false });
    nextFormStep({ ...data, ...values, taxId: fixedTax, isLastStep: false });
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
    if (data.taxIdType) {
      setValue('taxIdType', data.taxIdType);
    }
    if (data.incorporation) {
      setValue('incorporation', data.incorporation);
    }
    if (data.postCode) {
      setValue('postCode', data.postCode);
    }
    if (data.companyDocumentType) {
      setValue('companyDocumentType', data.companyDocumentType);
    }
    if (data.effectiveAt) {
      setValue('effectiveAt', data.effectiveAt);
    }
    if (data.expiredAt) {
      setValue('expiredAt', data.expiredAt);
    }
    if (data.number) {
      setValue('number', data.number);
    }
    if (data.gender) {
      setValue('gender', data.gender);
    }
    if (data.industryCode) {
      setValue('industryCode', data.industryCode);
    }
  }, [data]);

  useEffect(() => {
    if (uploadData && !errorDocuments && !loadingDocuments) {
      getOnboardingDocuments();
    }
  }, [uploadData, errorDocuments, loadingDocuments]);

  const validatedTaxIdPlaceHolder = 'XX-XXXXXXX';

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
                  error={!!errors.addressLine1}
                  helperText={errors.addressLine1?.message as string}
                  {...register('addressLine1', {
                    maxLength: {
                      value: 100,
                      message: t('addressTooLong'),
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message: t('addressInvalidCharacters'),
                    },
                    validate: {
                      noLeadingSpace: (value: string): any =>
                        !value.startsWith(' ') || t('addressStartsWithSpace'),
                      noTrailingSpace: (value: string): any =>
                        !value.endsWith(' ') || t('addressEndsWithSpace'),
                      noConsecutiveSpaces: (value: string): any =>
                        !/\s\s/.test(value) || t('addressConsecutiveSpaces'),
                    },
                  })}
                  inputProps={{
                    maxLength: 100,
                    pattern: '[a-zA-Z0-9\\s]+',
                    onInput: (e: React.FormEvent<HTMLInputElement>) => {
                      const input = e.currentTarget;
                      input.value = input.value.replace(/[^a-zA-Z0-9\s]/g, '');
                    },
                  }}
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
                  error={!!errors.addressLine2}
                  helperText={errors.addressLine2?.message as string}
                  {...register('addressLine2', {
                    maxLength: {
                      value: 100,
                      message: t('addressTooLong'),
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message: t('addressInvalidCharacters'),
                    },
                    validate: {
                      noLeadingSpace: (value: string): any =>
                        !value.startsWith(' ') || t('addressStartsWithSpace'),
                      noTrailingSpace: (value: string): any =>
                        !value.endsWith(' ') || t('addressEndsWithSpace'),
                      noConsecutiveSpaces: (value: string): any =>
                        !/\s\s/.test(value) || t('addressConsecutiveSpaces'),
                    },
                  })}
                  inputProps={{
                    maxLength: 100,
                    pattern: '[a-zA-Z0-9\\s]+',
                    onInput: (e: React.FormEvent<HTMLInputElement>) => {
                      const input = e.currentTarget;
                      input.value = input.value.replace(/[^a-zA-Z0-9\s]/g, '');
                    },
                  }}
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
          <Grid container>
            <Grid item xs={12} md={12}>
              <TaxIdInput
                title="onbTaxIdUSA"
                customPlaceholder={validatedTaxIdPlaceHolder}
                validationType={TaxIdValidation.USA}
                errors={errors}
                countryOrigin={Countries.USA}
                register={
                  register as unknown as TaxIdInputPropsType['register']
                }
                setValue={
                  setValue as unknown as TaxIdInputPropsType['setValue']
                }
                helperText={validatedTaxIdPlaceHolder}
                textFieldClassName="custom-textfield w-[90%]"
                errorClassName="text-xs mt-1"
              />
            </Grid>
            <Grid item xs={12} md={5} className="!mt-3">
              <FormControl fullWidth>
                <InputLabel id="companyDocumentType">
                  {t('onbTaxIdUSAType')}
                </InputLabel>
                <Controller
                  name="taxIdType"
                  control={control}
                  render={({ field: { value } }) => (
                    <Select
                      labelId="taxIdType"
                      id="taxIdType"
                      className="w-[90%]"
                      label={t('onbRegistrytaxIdType')}
                      error={!!errors.taxIdType}
                      value={
                        value
                          ? ['EIN', 'SSN'].find((document) =>
                              document.includes(value)
                            )
                          : 'EIN'
                      }
                      {...register('taxIdType', {
                        required: true,
                      })}
                    >
                      {['EIN', 'SSN'].map((documentOption) => (
                        <MenuItem key={documentOption} value={documentOption}>
                          {t(documentOption)}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
          <NewCompanyDocuments
            register={register}
            setValue={setValue}
            errors={errors}
            control={control}
          />
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
          <Grid item xs={12} className="!mb-[15px]">
            <UploadFileInput
              onChange={handleChangeFile}
              onDelete={() => {}}
              title={t('onbIncorporationDocumentUSA') || ''}
              classes="!mr-auto mx-[unset]"
              fullWidth
            />
            {onboardingDocuments?.map((file) => {
              if (
                file.document.type.id ===
                OnboardingDocumentTypeIds.constitutionFile
              ) {
                return (
                  <Link
                    key={file.id}
                    href={`${file.document.location}`}
                    variant="subtitle2"
                    className="!mx-auto !block text-center"
                    target="_blank"
                  >
                    {file.document.type.name}
                  </Link>
                );
              }
              return null;
            })}
          </Grid>
          {data.isCertificateUploaded ? (
            <Link
              href={`${data.isCertificateUploaded}`}
              variant="subtitle2"
              className="text-green-600"
              target="_blank"
            >
              {data.isCertificateUploaded.split('/').slice(-1)}
            </Link>
          ) : null}
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
