/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@efex-components/common/Button';
import DataLoadingWrapper from '@efex-components/common/DataLoadingWrapper';
import UploadFileInput from '@efex-components/common/Form/UploadFileInput';
import documentsSvc, {
  IOnboardingDocuments,
} from '@efex-services/documents/documentsSvc';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import useBoolean from '@main-hooks/useBoolean';
import {
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import IdRequirementsAlert from '@pages/onboarding/components/IdRequirementsAlert/IdRequirementsAlert';
import { selectBusiness } from '@pages/profile/store/selectors';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useApiCall } from 'use-api-call';
import { icon_check_circle_green } from '../../../../assets';
import { eighteenYearsAgo, onlyTextRegex } from '../constants';
import { useFormData } from '../context';
import AddressMxForm from './components/AddressMxForm';

export interface PersonFormData {
  birthDate: DateTime;
  citizenship: string;
  idType: string;
  idNumber: string;
  idFileFront: File | undefined;
  idFileBack: File | undefined;
  addressLine1: string;
  city: string;
  state: string;
  postCode: string;
  residenceFile: File | undefined;
  isLastStep: boolean;
  personNoFamilyAgreement: boolean;
  personResourceAgreement: boolean;
}

interface IPersonForm {
  loading: boolean;
  isDisabledEdit?: boolean;
  nextFormStep: (values: any) => void;
}

const PersonForm = ({
  loading,
  isDisabledEdit = false,
  nextFormStep,
}: IPersonForm) => {
  const { t } = useTranslation();
  const company = useSelector(selectBusiness);
  const { setFormValues, data } = useFormData();

  const {
    onboardingDocuments,
    getOnboardingDocuments,
  }: {
    onboardingDocuments: IOnboardingDocuments[];
    getOnboardingDocuments: () => void;
  } = useFormData();

  const [canGoNext, { setFalse: goNetx, setTrue: cantGoNext }] =
    useBoolean(false);

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
    control,
    register,
    setValue,
  } = useForm<PersonFormData>();

  const documentTypeOptionsMX: { key: string; value: string }[] = [
    { value: 'INE', key: t('INE') },
    { value: 'PASS', key: t('PssType') },
  ];

  const onSubmit = handleSubmit(async (values) => {
    setFormValues({ ...data, ...values, isLastStep: false });
    nextFormStep({ ...data, ...values, isLastStep: false });
  });

  const fieldsWatched = useWatch({
    control,
    name: [
      'birthDate',
      'citizenship',
      'idType',
      'idNumber',
      'idFileFront',
      'idFileBack',
      'addressLine1',
      'residenceFile',
      'city',
      'state',
      'postCode',
    ],
  });

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = event.target;
    if (files && files.length) {
      const filesArray: File[] = [];
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index <= files.length - 1; index++) {
        filesArray[index] = files.item(index) as File;
      }
      uploadDocuments({
        currentDocuments: filesArray,
        name,
      });
    }
  };

  useEffect(() => {
    setValue(
      'birthDate',
      data?.birthDate || DateTime.fromJSDate(eighteenYearsAgo)
    );
    if (data.citizenship) {
      setValue('citizenship', data.citizenship);
    }
    if (data.idType) {
      setValue('idType', data.idType);
    }
    if (data.idNumber) {
      setValue('idNumber', data.idNumber);
    }
    if (data.city) {
      setValue('city', data.city);
    }
    if (data.state) {
      setValue('state', data.state);
    }
    if (data.addressLine1) {
      setValue('addressLine1', data.addressLine1);
    }
    if (data.postCode) {
      setValue('postCode', data.postCode);
    }
    if (data.personNoFamilyAgreement) {
      setValue('personNoFamilyAgreement', data.personNoFamilyAgreement);
    }
    if (data.personResourceAgreement) {
      setValue('personResourceAgreement', data.personResourceAgreement);
    }
  }, [data]);

  useEffect(() => {
    if (uploadData && !errorDocuments && !loadingDocuments) {
      getOnboardingDocuments();
    }
  }, [uploadData, errorDocuments, loadingDocuments]);

  useEffect(() => {
    if (onboardingDocuments?.length >= 2) {
      goNetx();
    } else {
      cantGoNext();
    }
  }, [onboardingDocuments]);

  return (
    <form onSubmit={onSubmit} autoComplete="off" className="mt-3">
      <Typography variant="h4" className="!font-medium">
        {t('onbPlsEnterPersonInformation')}
      </Typography>
      <Grid container rowSpacing={2} columnSpacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography variant="subtitle2">{t(`onbStHlBirthDate`)}</Typography>
            <div className="flex w-full">
              <Controller
                name="birthDate"
                rules={{
                  required: true,
                  validate: (date) =>
                    date <= DateTime.fromJSDate(eighteenYearsAgo),
                }}
                defaultValue={DateTime.fromJSDate(eighteenYearsAgo)}
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <DatePicker
                      {...field}
                      disableFuture
                      maxDate={DateTime.fromJSDate(eighteenYearsAgo)}
                      className={clsx('w-full w-[90%]')}
                      onChange={(value) => {
                        if (!value) return;
                        field.onChange(value);
                      }}
                      slotProps={{
                        // eslint-disable-next-line react/no-unstable-nested-components
                        textField: (params) => (
                          <TextField
                            {...params}
                            size="small"
                            error={!!errors.birthDate}
                            fullWidth
                          />
                        ),
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
              {fieldsWatched[0] && (
                <img
                  src={icon_check_circle_green}
                  alt=""
                  className="w-[25px] ml-[10px]"
                />
              )}
            </div>
            {errors && errors.birthDate && (
              <p className="text-orange-600 text-xs mt-1">
                {`${(t('defaultError'), t('dateIsNot18YearsOld'))}`}
              </p>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography variant="subtitle2">
              {t(`onbStHlCitizenship`)}
            </Typography>
            <div className="flex w-full">
              <TextField
                autoComplete="off"
                type="text"
                className="custom-textfield w-[90%]"
                size="small"
                placeholder={t(`onbStHlCitizenship`) as string}
                error={!!errors.citizenship}
                {...register('citizenship', {
                  required: true,
                  pattern: {
                    value: onlyTextRegex,
                    message: '',
                  },
                })}
              />
              {fieldsWatched[1] && fieldsWatched[1].length > 0 && (
                <img
                  src={icon_check_circle_green}
                  alt=""
                  className="w-[25px] ml-[10px]"
                />
              )}
            </div>
            {errors &&
              errors.citizenship &&
              errors.citizenship.type === 'required' && (
                <p className="text-orange-600 text-xs mt-1">
                  {t('defaultError')}
                </p>
              )}
            {errors &&
              errors.citizenship &&
              errors.citizenship.type === 'pattern' && (
                <p className="text-orange-600 text-xs mt-1">
                  {t('onbOnlyTextError')}
                </p>
              )}
          </FormControl>
        </Grid>
        <Grid xs={12} className="mt-4 pb-1 ml-3">
          <Typography variant="subtitle1" className="!ml-2">
            {t('onbStHlGovId')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography variant="subtitle2" id="idType">
              {t('onbStHlIdType')}
            </Typography>
            <IdRequirementsAlert />
            <div className="flex w-full">
              <Controller
                name="idType"
                rules={{ required: true }}
                control={control}
                defaultValue={
                  data?.idType
                    ? documentTypeOptionsMX.find(
                        (item) => item.value === data.idType
                      )?.value
                    : documentTypeOptionsMX[0].value
                }
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    labelId="idType"
                    size="small"
                    className="custom-textfield !w-[85%]"
                    error={!!errors.idType}
                  >
                    {documentTypeOptionsMX.map((idType) => (
                      <MenuItem key={idType.key} value={idType.value}>
                        {idType.key}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {fieldsWatched[2] && fieldsWatched[2].length > 0 && (
                <img
                  src={icon_check_circle_green}
                  alt=""
                  className="w-[26px] ml-[20px] mr-[10px]"
                />
              )}
            </div>
            {errors && errors.idType && (
              <p className="text-orange-600 text-xs mt-1">
                {t('defaultError')}
              </p>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <Typography variant="subtitle2">{t(`onbStHlIdNumber`)}</Typography>
            <div className="flex w-full">
              <TextField
                autoComplete="off"
                type="text"
                className="custom-textfield w-[90%]"
                size="small"
                placeholder={t('onbStHlIdNumber') || ''}
                error={!!errors.idNumber}
                {...register('idNumber', { required: true })}
              />
              {fieldsWatched[3] && fieldsWatched[3].length > 0 && (
                <img
                  src={icon_check_circle_green}
                  alt=""
                  className="w-[25px] ml-[10px]"
                />
              )}
            </div>
            {errors && errors.idNumber && (
              <p className="text-orange-600 text-xs mt-1">
                {t('defaultError')}
              </p>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <UploadFileInput
            onChange={handleChangeFile}
            inputName="personalIdentification"
            onDelete={() => {}}
            title={t('onbStHlIdFileFront') || ''}
            classes="!mr-auto mx-[unset]"
            fullWidth
          />
          {onboardingDocuments?.map((file) => {
            if (
              file.document.type.id ===
              OnboardingDocumentTypeIds.personalIdentification
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
        {fieldsWatched[2] === 'INE' ? (
          <Grid item xs={12} md={6}>
            <UploadFileInput
              onChange={handleChangeFile}
              inputName="personalIdentificationBack"
              onDelete={() => {}}
              title={t('onbStHlIdFileBack') || ''}
              classes="!mr-auto mx-[unset]"
              fullWidth
            />
            {onboardingDocuments?.map((file) => {
              if (
                file.document.type.id ===
                OnboardingDocumentTypeIds.personalIdentificationBack
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
        ) : null}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography variant="subtitle2">{t(`onbStHlResidence`)}</Typography>
            <div className="flex w-full">
              <TextField
                autoComplete="off"
                type="text"
                className="custom-textfield w-[90%]"
                size="small"
                placeholder={t('onbStakeAddress1') || ''}
                error={!!errors.addressLine1}
                {...register('addressLine1', { required: true })}
              />
              {fieldsWatched[6] && fieldsWatched[6].length > 0 && (
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
          <AddressMxForm
            errors={errors}
            control={control as any}
            FieldsWatched={fieldsWatched}
            register={register as any}
            setValue={setValue as any}
            data={data}
            isPersonForm
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name="personResourceAgreement"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={t('regLegalRepresentativePersonStatament')}
                />
              )}
            />
          </FormControl>
          {errors &&
            errors.personResourceAgreement &&
            errors.personResourceAgreement.type === 'required' && (
              <p className="text-orange-600 text-xs mt-1">
                {t('defaultError')}
              </p>
            )}
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name="personNoFamilyAgreement"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={t('regResourceStatementPerson')}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <UploadFileInput
            onChange={handleChangeFile}
            inputName="proofOfAddress"
            onDelete={() => {}}
            title={t('onbStHlResidenceFile') || ''}
            subTitle={t('onbOldDocument') || ''}
            classes="!mr-auto mx-[unset]"
            fullWidth
          />
          {onboardingDocuments?.map((file) => {
            if (
              file.document.type.id === OnboardingDocumentTypeIds.proofOfAddress
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
        <Grid item xs={12} className="flex justify-center gap-10">
          {!isDisabledEdit ? (
            <DataLoadingWrapper loadingData={loading} variant="spinner">
              <Button disabled={canGoNext} size="large" type="submit">
                {t('continue')}
              </Button>
            </DataLoadingWrapper>
          ) : (
            <Alert severity="info">{t('kybStepTwoTitle')}</Alert>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

export default PersonForm;
