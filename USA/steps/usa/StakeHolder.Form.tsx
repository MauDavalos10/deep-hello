/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@efex-components/common/Button';
import ExpandMore from '@efex-components/common/ExpandMore';
import ModalDetail from '@efex-components/common/Modal/Modal';
import FileInputV3 from '@efex-components/EfexDS/FileInput/FileInput';
import { IOnboardingDocuments } from '@efex-services/documents/documentsSvc';
import {
  OnboardingDocumentTypeIds,
  OnboardingUsaDocumentTypeIds,
} from '@efex-services/documents/types';
import useBoolean from '@main-hooks/useBoolean';
import Autorenew from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import IdRequirementsAlert from '@pages/onboarding/components/IdRequirementsAlert/IdRequirementsAlert';
import GENDER_OPTIONS from '@pages/onboarding/Mexico/constants/genderOptions';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { icon_check_circle_green } from '../../../../../assets';
import type { StakeHoldersFormData } from '../../../../../services/client/types';
import {
  TEXTS_MAX_LENGTH,
  TOTAL_FILES_REQUIRED,
  eighteenYearsAgo,
  onlyNumbersRegex,
  onlyTextRegex,
} from '../../constants';
import {
  USA_COMPANY_DOCUMENTS,
  USA_COMPANY_DOCUMENTS_LABELS,
} from '../../constants/config';

interface IStakeHolders {
  index: number;
  formError: string;
  remove: (index: number) => void;
  update: (index: number, data: StakeHoldersFormData) => void;
  handleChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropChangeFile: (files: FileList, name: string) => void;
  handleDeleteFile: (id: string | number) => void;
  data?: StakeHoldersFormData;
  loading: boolean;
  uploadedFiles: IOnboardingDocuments[];
  stakeholderId?: number;
}

const StakeHolderFormUSA = ({
  index,
  formError,
  remove,
  update,
  handleChangeFile,
  handleDropChangeFile,
  handleDeleteFile,
  uploadedFiles,
  data,
  loading = false,
  stakeholderId,
}: IStakeHolders) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(!stakeholderId);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [selectedCompanyDocument, setSelectedCompanyDocument] = useState<
    string | undefined
  >();
  const [canGoNext, { setFalse: cantGoNext, setTrue: goNext }] =
    useBoolean(false);

  const { id } = data || {};

  const getName = (): string | undefined => {
    const { name, lastName, secondLastName } = data || {};
    if (!name || !lastName) return undefined;
    return `${name} ${lastName} ${secondLastName}`;
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    setValue,
  } = useForm<StakeHoldersFormData>({ mode: 'all' });

  const onSubmit = handleSubmit(async (values) => {
    update(id ?? index, { id, ...values });
    setIsLoading(true);
  });

  const fieldsWatched = useWatch({
    control,
    name: [
      'name',
      'birthDate',
      'citizenship',
      'percentage',
      'title',
      'idType',
      'idNumber',
      'idFileFront',
      'idFileBack',
      'addressLine1',
      'residenceFile',
      'addressLine2',
      'city',
      'state',
      'postCode',
      'lastName',
    ],
  });

  const filesWatch = useWatch({
    control,
    name: ['idType'],
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleRemove = () => {
    if (id) {
      setConfirmDeletion(true);
      return;
    }
    remove(index);
  };

  useEffect(() => {
    if (data?.name) {
      setValue('name', data.name);
    }
    if (data?.lastName) {
      setValue('lastName', data.lastName);
    }
    setValue(
      'birthDate',
      data?.birthDate
        ? DateTime.fromISO(data.birthDate as unknown as string)
        : DateTime.fromJSDate(eighteenYearsAgo)
    );
    if (data?.citizenship) {
      setValue('citizenship', data.citizenship);
    }
    if (data?.percentage) {
      setValue('percentage', data.percentage);
    }
    if (data?.title) {
      setValue('title', data.title);
    }
    if (data?.idNumber) {
      setValue('idNumber', data.idNumber);
    }
    if (data?.addressLine1) {
      setValue('addressLine1', data.addressLine1);
    }
    if (data?.addressLine2) {
      setValue('addressLine2', data.addressLine2);
    }
    if (data?.city) {
      setValue('city', data.city);
    }
    if (data?.state) {
      setValue('state', data.state);
    }
    if (data?.postCode) {
      setValue('postCode', data.postCode);
    }
    if (data?.dataConfirm) {
      setValue('dataConfirm', data.dataConfirm);
    }
    if (data?.gender) {
      setValue('gender', data.gender);
    }
    if (data?.idType) {
      setValue('idType', data.idType);
    }
    if (data?.expiredAt) {
      setValue('expiredAt', data.expiredAt);
    }
    if (data?.effectiveAt) {
      setValue('effectiveAt', data.effectiveAt);
    }
  }, [data]);

  useEffect(() => {
    const filesAmount: number =
      filesWatch[0] === 'passport'
        ? TOTAL_FILES_REQUIRED.PASSPORT
        : TOTAL_FILES_REQUIRED.OTHERS;
    if (
      (uploadedFiles?.length ?? 0) >= filesAmount &&
      !data?.documents?.length
    ) {
      goNext();
    } else if (data?.documents?.length) {
      goNext();
    } else {
      cantGoNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles, filesWatch, data]);

  useEffect(() => {
    if (filesWatch[0]) {
      setSelectedCompanyDocument(filesWatch[0].toLowerCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesWatch]);

  return (
    <>
      <form onSubmit={onSubmit} autoComplete="off" className="mt-3">
        <Card>
          <CardActions disableSpacing>
            <Typography variant="h6" className="capitalize">
              {getName() ?? t('onbStHlSectionTitle', { index: index + 1 })}
            </Typography>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto">
            <CardContent>
              {formError.length > 0 ? (
                <Alert variant="outlined" severity="error">
                  {formError}
                </Alert>
              ) : null}
              <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlName`)}
                    </Typography>
                    <div className="flex w-full">
                      <TextField
                        autoComplete="off"
                        type="text"
                        className="custom-textfield w-[90%]"
                        size="small"
                        placeholder={t(`onbStHlName`) as string}
                        helperText={t(`onbStHlNameMessage`) as string}
                        error={!!errors.name}
                        {...register('name', {
                          required: true,
                          maxLength: TEXTS_MAX_LENGTH,
                          pattern: {
                            value: onlyTextRegex,
                            message: '',
                          },
                        })}
                      />
                      {fieldsWatched[0] && fieldsWatched[0].length > 0 && (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      )}
                    </div>
                    {errors &&
                      errors.name &&
                      errors.name.type === 'required' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    {errors &&
                      errors.name &&
                      errors.name.type === 'pattern' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('onbOnlyTextError')}
                        </p>
                      )}
                    {errors &&
                      errors.name &&
                      errors.name.type === 'maxLength' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('onbMaxDigits', { digits: TEXTS_MAX_LENGTH })}
                        </p>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlLastName`)}
                    </Typography>
                    <div className="flex w-full">
                      <TextField
                        autoComplete="off"
                        type="text"
                        className="custom-textfield w-[90%]"
                        size="small"
                        placeholder={t(`onbStHlLastName`) as string}
                        helperText={t(`onbStHlNameMessage`) as string}
                        error={!!errors.lastName}
                        {...register('lastName', {
                          required: false,
                          maxLength: TEXTS_MAX_LENGTH,
                          pattern: {
                            value: onlyTextRegex,
                            message: '',
                          },
                        })}
                      />
                      {fieldsWatched[15] && fieldsWatched[15].length > 0 && (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      )}
                    </div>
                    {errors &&
                      errors.lastName &&
                      errors.lastName.type === 'required' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    {errors &&
                      errors.lastName &&
                      errors.lastName.type === 'pattern' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('onbOnlyTextError')}
                        </p>
                      )}
                    {errors &&
                      errors.lastName &&
                      errors.lastName.type === 'maxLength' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('onbMaxDigits', { digits: TEXTS_MAX_LENGTH })}
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
                      {fieldsWatched[2] && fieldsWatched[2].length > 0 && (
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
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlPercentage`)}
                    </Typography>
                    <div className="flex w-full">
                      <TextField
                        autoComplete="off"
                        type="number"
                        className="custom-textfield w-[90%]"
                        size="small"
                        placeholder="50"
                        error={!!errors.percentage}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        {...register('percentage', {
                          required: true,
                          pattern: {
                            value: onlyNumbersRegex,
                            message: '',
                          },
                          max: 100,
                        })}
                      />
                      {fieldsWatched[3] && fieldsWatched[3].length > 0 && (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      )}
                    </div>
                    {errors &&
                      errors.percentage &&
                      errors.percentage.type === 'required' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    {errors &&
                      errors.percentage &&
                      errors.percentage.type === 'pattern' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('onbOnlyNumberError')}
                        </p>
                      )}
                    {errors &&
                      errors.percentage &&
                      errors.percentage.type === 'max' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('onbPercentageError')}
                        </p>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlTitle`)}
                    </Typography>
                    <div className="flex w-full">
                      <TextField
                        autoComplete="off"
                        type="text"
                        className="custom-textfield w-[90%]"
                        size="small"
                        placeholder={t('onbStHlTitle') || ''}
                        error={!!errors.title}
                        {...register('title', {
                          required: true,
                          maxLength: TEXTS_MAX_LENGTH,
                          pattern: {
                            value: onlyTextRegex,
                            message: '',
                          },
                        })}
                      />
                      {fieldsWatched[4] && fieldsWatched[4].length > 0 && (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      )}
                    </div>
                    {errors &&
                      errors.title &&
                      errors.title.type === 'required' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    {errors &&
                      errors.title &&
                      errors.title.type === 'pattern' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('onbOnlyTextError')}
                        </p>
                      )}
                    {errors &&
                      errors.title &&
                      errors.title.type === 'maxLength' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('onbMaxDigits', { digits: TEXTS_MAX_LENGTH })}
                        </p>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} />
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlBirthDate`)}
                    </Typography>
                    <div className="flex w-full">
                      <Controller
                        name="birthDate"
                        rules={{ required: true }}
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterLuxon}>
                            <DatePicker
                              {...field}
                              disableFuture
                              maxDate={DateTime.fromJSDate(eighteenYearsAgo)}
                              className={clsx('w-[90%]')}
                              onChange={(value) => {
                                if (!value) return;
                                field.onChange(value);
                              }}
                              value={DateTime.fromISO(
                                field.value as unknown as string
                              )}
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
                      {fieldsWatched[1] && (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      )}
                    </div>
                    {errors && errors.birthDate && (
                      <p className="text-orange-600 text-xs mt-1">
                        {t('defaultError')}
                      </p>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">{t(`regGender`)}</Typography>
                  <FormControl fullWidth>
                    <Controller
                      name="gender"
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => (
                        <Select
                          labelId="gender"
                          id="gender"
                          label={t('regGender')}
                          error={!!errors.gender}
                          {...register('gender', { required: true })}
                          value={
                            field?.value
                              ? GENDER_OPTIONS.find(
                                  (genderOption) =>
                                    genderOption.key === field.value
                                )?.key
                              : null
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          {GENDER_OPTIONS.map((genderOption) => (
                            <MenuItem
                              key={genderOption.key}
                              value={genderOption.key}
                            >
                              {t(genderOption.value)}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-orange-600 text-xs">
                        {t('regGenderValidation')}
                      </p>
                    )}
                  </FormControl>
                </Grid>

                <Grid xs={12} className="mt-4">
                  <Typography variant="subtitle1" className="!ml-2">
                    {t('onbRegistrycompanyDocumentType')}
                  </Typography>
                  <IdRequirementsAlert />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="idType">
                      {t('onbRegistrycompanyDocumentType')}
                    </InputLabel>
                    <Controller
                      name="idType"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          labelId="idType"
                          id="idType"
                          className="w-[90%]"
                          label={t('onbRegistrycompanyDocumentType')}
                          error={!!errors.idType}
                          value={
                            value
                              ? USA_COMPANY_DOCUMENTS_LABELS.find((document) =>
                                  document.name.includes(value.toLowerCase())
                                )?.name
                              : ''
                          }
                          {...register('idType', {
                            required: true,
                          })}
                          onChange={(e) => {
                            setSelectedCompanyDocument(
                              e.target.value as string
                            );
                            onChange(e.target.value);
                          }}
                        >
                          {USA_COMPANY_DOCUMENTS_LABELS.map(
                            (documentOption) => (
                              <MenuItem
                                key={documentOption.name}
                                value={documentOption.name}
                              >
                                {t(documentOption.label)}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      )}
                    />
                  </FormControl>
                  {errors &&
                    errors.idType &&
                    errors.idType.type === 'required' && (
                      <p className="text-orange-600 text-xs mt-1">
                        {t('defaultError')}
                      </p>
                    )}
                </Grid>
                {selectedCompanyDocument
                  ? USA_COMPANY_DOCUMENTS.filter((document) =>
                      document.name.includes(selectedCompanyDocument)
                    ).map((entityDocument) => (
                      <div className="w-full px-3" key={entityDocument.name}>
                        <FileInputV3
                          key={entityDocument.name}
                          inputName={entityDocument.name}
                          onChange={handleChangeFile}
                          onDropChange={handleDropChangeFile}
                          onDelete={handleDeleteFile}
                          documents={
                            data?.documents?.filter(
                              (element) =>
                                element.document.type.id ===
                                OnboardingUsaDocumentTypeIds[
                                  entityDocument.name as keyof typeof OnboardingUsaDocumentTypeIds
                                ]
                            ) ??
                            uploadedFiles.filter(
                              (element) =>
                                element.document.type.id ===
                                OnboardingUsaDocumentTypeIds[
                                  entityDocument.name as keyof typeof OnboardingUsaDocumentTypeIds
                                ]
                            )
                          }
                          title={
                            t(
                              entityDocument.label || entityDocument.translation
                            ) as string
                          }
                          wrapperClasses="!m-0 !mb-2"
                        />
                      </div>
                    ))
                  : null}
                {selectedCompanyDocument && selectedCompanyDocument !== '' ? (
                  <>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle2">
                          {t(`onbEffectiveDate`)}
                        </Typography>
                        <Controller
                          name="effectiveAt"
                          rules={{ required: true }}
                          control={control}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                              <DatePicker
                                {...field}
                                className={clsx('w-[90%]')}
                                onChange={(value) => {
                                  if (!value) return;
                                  field.onChange(value);
                                }}
                                value={DateTime.fromISO(
                                  field.value as unknown as string
                                )}
                                slotProps={{
                                  // eslint-disable-next-line react/no-unstable-nested-components
                                  textField: (params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      error={!!errors.effectiveAt}
                                      fullWidth
                                    />
                                  ),
                                }}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        {errors && errors.effectiveAt && (
                          <p className="text-orange-600 text-xs mt-1">
                            {t('defaultError')}
                          </p>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle2">
                          {t(`onbExpiryDate`)}
                        </Typography>
                        <Controller
                          name="expiredAt"
                          rules={{ required: true }}
                          control={control}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                              <DatePicker
                                {...field}
                                className={clsx('w-[90%]')}
                                onChange={(value) => {
                                  if (!value) return;
                                  field.onChange(value);
                                }}
                                value={DateTime.fromISO(
                                  field.value as unknown as string
                                )}
                                slotProps={{
                                  // eslint-disable-next-line react/no-unstable-nested-components
                                  textField: (params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      error={!!errors.expiredAt}
                                      fullWidth
                                    />
                                  ),
                                }}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        {errors && errors.expiredAt && (
                          <p className="text-orange-600 text-xs mt-1">
                            {t('defaultError')}
                          </p>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle2">
                          {t(`onbNumber`)}
                        </Typography>
                        <TextField
                          autoComplete="off"
                          type="text"
                          className="custom-textfield w-[90%]"
                          size="small"
                          error={!!errors.idNumber}
                          placeholder={t(`onbNumber`) as string}
                          {...register('idNumber', { required: true })}
                        />
                        {errors && errors.idNumber && (
                          <p className="text-orange-600 text-xs mt-1">
                            {t('defaultError')}
                          </p>
                        )}
                      </FormControl>
                    </Grid>
                  </>
                ) : null}

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlResidence`)}
                    </Typography>
                    <div className="flex w-full">
                      <TextField
                        autoComplete="off"
                        type="text"
                        className="custom-textfield w-[90%]"
                        size="small"
                        placeholder={t('onbStakeAddress1') || ''}
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
                              !value.startsWith(' ') ||
                              t('addressStartsWithSpace'),
                            noTrailingSpace: (value: string): any =>
                              !value.endsWith(' ') || t('addressEndsWithSpace'),
                            noConsecutiveSpaces: (value: string): any =>
                              !/\s\s/.test(value) ||
                              t('addressConsecutiveSpaces'),
                          },
                        })}
                        inputProps={{
                          maxLength: 100,
                          pattern: '[a-zA-Z0-9\\s]+',
                          onInput: (e: React.FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            input.value = input.value.replace(
                              /[^a-zA-Z0-9\s]/g,
                              ''
                            );
                          },
                        }}
                      />
                      {fieldsWatched[9] && fieldsWatched[9].length > 0 ? (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      ) : (
                        <div className="!mr-[35px]" />
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
                              !value.startsWith(' ') ||
                              t('addressStartsWithSpace'),
                            noTrailingSpace: (value: string): any =>
                              !value.endsWith(' ') || t('addressEndsWithSpace'),
                            noConsecutiveSpaces: (value: string): any =>
                              !/\s\s/.test(value) ||
                              t('addressConsecutiveSpaces'),
                          },
                        })}
                        inputProps={{
                          maxLength: 100,
                          pattern: '[a-zA-Z0-9\\s]+',
                          onInput: (e: React.FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            input.value = input.value.replace(
                              /[^a-zA-Z0-9\s]/g,
                              ''
                            );
                          },
                        }}
                      />
                      {fieldsWatched[11] && fieldsWatched[11].length > 0 ? (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      ) : (
                        <div className="!mr-[35px]" />
                      )}
                    </div>
                  </FormControl>
                </Grid>
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
                      {fieldsWatched[12] && fieldsWatched[12].length > 0 && (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      )}
                    </div>
                    {errors &&
                      errors.city &&
                      errors.city.type === 'required' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    {errors &&
                      errors.city &&
                      errors.city.type === 'pattern' && (
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
                        className="custom-textfield w-[90%]"
                        size="small"
                        placeholder={t(`state`) as string}
                        {...register('state', {
                          required: true,
                          pattern: {
                            value: onlyTextRegex,
                            message: '',
                          },
                        })}
                      />
                      {fieldsWatched[13] && fieldsWatched[13].length > 0 && (
                        <img
                          src={icon_check_circle_green}
                          alt=""
                          className="w-[25px] ml-[10px]"
                        />
                      )}
                    </div>
                    {errors &&
                      errors.state &&
                      errors.state.type === 'required' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    {errors &&
                      errors.state &&
                      errors.state.type === 'pattern' && (
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
                      {fieldsWatched[14] &&
                        (fieldsWatched[14] as any).length > 0 && (
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
                <Grid item xs={12} className="!mb-5">
                  <FileInputV3
                    inputName="proofOfAddress"
                    onChange={handleChangeFile}
                    onDropChange={handleDropChangeFile}
                    onDelete={handleDeleteFile}
                    documents={
                      data?.documents?.filter(
                        (element) =>
                          element.document.type.id ===
                          OnboardingDocumentTypeIds.proofOfAddress
                      ) ??
                      uploadedFiles.filter(
                        (element) =>
                          element.document.type.id ===
                          OnboardingDocumentTypeIds.proofOfAddress
                      )
                    }
                    title={t('onbStHlResidenceFile') || ''}
                    subTitle={t('onbOldDocument') || ''}
                    wrapperClasses="!m-0 !mb-2"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="dataConfirm"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} />}
                          label={t('regConfirmCheckBox')}
                        />
                      )}
                    />
                    {errors.dataConfirm && (
                      <p className="text-orange-600 text-xs">
                        {t('requiredField')}
                      </p>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <CardActions className="flex justify-center gap-10">
                <Button
                  size="large"
                  type="button"
                  className="justify-around"
                  variant="secondary"
                  onClick={handleRemove}
                  disabled={isLoading || loading}
                  iconEnd={!loading ? <DeleteIcon /> : undefined}
                  icon={
                    !loading ? undefined : (
                      <Autorenew className="animate-spin" />
                    )
                  }
                >
                  {t('onbRemove')}
                </Button>
                <Button
                  icon={
                    loading ? <Autorenew className="animate-spin" /> : undefined
                  }
                  disabled={!canGoNext || loading}
                  size="large"
                  type="submit"
                >
                  {t(id ? 'update' : 'onbSaveStk')}
                </Button>
              </CardActions>
            </CardContent>
          </Collapse>
        </Card>
      </form>
      {confirmDeletion ? (
        <ModalDetail
          open={confirmDeletion}
          onClose={() => setConfirmDeletion(false)}
          title={t('onbConfirmRemove') || ''}
        >
          <Button
            variant="secondary"
            className="block mx-auto mt-5"
            icon={
              !loading ? <DeleteIcon /> : <Autorenew className="animate-spin" />
            }
            onClick={() => {
              remove(id ?? index);
              setConfirmDeletion(false);
            }}
          >
            {t('onbRemove')}
          </Button>
        </ModalDetail>
      ) : null}
    </>
  );
};

export default StakeHolderFormUSA;
