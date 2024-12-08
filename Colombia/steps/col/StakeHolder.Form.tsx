/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@efex-components/common/Button';
import ExpandMore from '@efex-components/common/ExpandMore';
import ModalDetail from '@efex-components/common/Modal/Modal';
import FileInputV3 from '@efex-components/EfexDS/FileInput/FileInput';
import { IOnboardingDocuments } from '@efex-services/documents/documentsSvc';
import { OnboardingDocumentTypeIds } from '@efex-services/documents/types';
import useBoolean from '@main-hooks/useBoolean';
import Autorenew from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  Collapse,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
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
  eighteenYearsAgo,
  onlyNumbersRegex,
  onlyTextRegex,
} from '../../constants';

interface IStakeHolders {
  index: number;
  formError: string;
  data?: StakeHoldersFormData;
  loading: boolean;
  uploadedFiles: IOnboardingDocuments[];
  remove: (index: number) => void;
  update: (index: number, data: StakeHoldersFormData) => void;
  handleChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropChangeFile: (files: FileList, name: string) => void;
  handleDeleteFile: (id: string | number) => void;
}

const StakeHolderFormCol = ({
  index,
  formError,
  data,
  loading = false,
  uploadedFiles,
  remove,
  update,
  handleChangeFile,
  handleDropChangeFile,
  handleDeleteFile,
}: IStakeHolders) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const { id } = data || {};

  const getName = (): string | undefined => {
    const { name, lastName, secondLastName } = data || {};
    if (!name || !lastName) return undefined;
    return `${name} ${lastName} ${secondLastName}`;
  };

  const [canGoNext, { setFalse: cantGoNext, setTrue: goNext }] =
    useBoolean(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    setValue,
  } = useForm<StakeHoldersFormData>({ mode: 'all' });

  const documentTypeOptions: { key: string; value: string }[] = [
    { value: 'CC', key: t('CCType') },
    { value: 'CE', key: t('CEType') },
    { value: 'NIT', key: t('NITType') },
    { value: 'PASS', key: t('PASSType') },
    { value: 'PEP', key: t('PEPType') },
  ];
  const [fileTypeValidation, setFileTypeValidation] = useState(
    documentTypeOptions[0].value
  );

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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const validateTypeFile = (ev: SelectChangeEvent) => {
    setFileTypeValidation(ev.target.value);
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
      data?.birthDate || DateTime.fromJSDate(eighteenYearsAgo)
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
    if (data?.idType) {
      setValue('idType', data.idType);
    }
    if (data?.idType) {
      setFileTypeValidation(
        documentTypeOptions.filter((item) => item.value === data.idType)[0]
          ?.value
      );
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
    if (data?.gender) {
      setValue('gender', data.gender);
    }
    if (data?.expiredAt) {
      setValue('expiredAt', data.expiredAt);
    }
    if (data?.effectiveAt) {
      setValue('effectiveAt', data.effectiveAt);
    }
  }, [data]);

  useEffect(() => {
    const filesAmount = fileTypeValidation !== 'PASS' ? 2 : 1;
    if ((uploadedFiles?.length ?? 0) >= filesAmount + 1) {
      goNext();
    } else {
      cantGoNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles]);

  useEffect(() => {
    const filesAmount = fileTypeValidation === 'INE' ? 2 : 1;
    if (data?.documents?.length === filesAmount) {
      goNext();
    } else {
      cantGoNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <form onSubmit={onSubmit} autoComplete="off" className="mt-3">
        <Alert severity="info">{t('infoStakeholders')}</Alert>
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
                      {t(`onbStHlLastNameSingle`)}
                    </Typography>
                    <div className="flex w-full">
                      <TextField
                        autoComplete="off"
                        type="text"
                        className="custom-textfield w-[90%]"
                        size="small"
                        placeholder={t(`onbStHlLastNameSingle`) as string}
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
                              className={clsx('w-full w-[90%]')}
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
                <Grid xs={12} className="mt-4">
                  <Typography variant="subtitle1" className="!ml-2">
                    {t('onbStHlGovId')}
                  </Typography>
                  <IdRequirementsAlert />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2" id="idType">
                      {t('onbStHlIdType')}
                    </Typography>
                    <div className="flex w-full">
                      <Select
                        fullWidth
                        defaultValue={
                          data?.idType
                            ? documentTypeOptions.filter(
                                (item) => item.value === data.idType
                              )[0]?.value
                            : documentTypeOptions[0].value
                        }
                        {...register('idType', { required: true })}
                        labelId="idType"
                        name="idType"
                        size="small"
                        className="custom-textfield !w-[85%]"
                        error={!!errors.idType}
                        onChange={validateTypeFile}
                      >
                        {documentTypeOptions.map((idType) => (
                          <MenuItem key={idType.key} value={idType.value}>
                            {idType.key}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldsWatched[5] && fieldsWatched[5].length > 0 && (
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
                    <Typography variant="subtitle2">
                      {t(`onbStHlIdNumber`)}
                    </Typography>
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
                      {fieldsWatched[6] && fieldsWatched[6].length > 0 && (
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
                  <FileInputV3
                    inputName="personalIdentification"
                    onChange={handleChangeFile}
                    onDropChange={handleDropChangeFile}
                    onDelete={handleDeleteFile}
                    title={t('onbStHlIdFileFront') || ''}
                    documents={
                      data?.documents?.filter(
                        (element) =>
                          element.document.type.id ===
                          OnboardingDocumentTypeIds.personalIdentification
                      ) ??
                      uploadedFiles.filter(
                        (element) =>
                          element.document.type.id ===
                          OnboardingDocumentTypeIds.personalIdentification
                      )
                    }
                  />
                </Grid>
                {fileTypeValidation !== 'PASS' ? (
                  <Grid item xs={12} md={6}>
                    <FileInputV3
                      inputName="personalIdentificationBack"
                      onChange={handleChangeFile}
                      onDropChange={handleDropChangeFile}
                      onDelete={handleDeleteFile}
                      title={t('onbStHlIdFileBack') || ''}
                      documents={
                        data?.documents?.filter(
                          (element) =>
                            element.document.type.id ===
                            OnboardingDocumentTypeIds.personalIdentificationBack
                        ) ??
                        uploadedFiles.filter(
                          (element) =>
                            element.document.type.id ===
                            OnboardingDocumentTypeIds.personalIdentificationBack
                        )
                      }
                    />
                  </Grid>
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
                        className="custom-textfield w-full max-w-[920px]"
                        size="small"
                        placeholder={t('onbStakeAddress1') || ''}
                        error={!!errors.addressLine1}
                        {...register('addressLine1', { required: true })}
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
                        className="custom-textfield w-full max-w-[920px]"
                        size="small"
                        placeholder={t(`onbStakeAddress2`) as string}
                        {...register('addressLine2')}
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
                <Grid item xs={12} className="!mt-[-20px] !mb-5">
                  <FileInputV3
                    inputName="proofOfAddress"
                    onChange={handleChangeFile}
                    onDropChange={handleDropChangeFile}
                    onDelete={handleDeleteFile}
                    title={t('onbStHlResidenceFile') || ''}
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
                  />
                </Grid>
              </Grid>
              <CardActions className="flex justify-center gap-10">
                <Button
                  size="large"
                  type="button"
                  className="justify-around"
                  variant="secondary"
                  disabled={isLoading || loading}
                  onClick={handleRemove}
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
                  {t('onbSaveStk')}
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

export default StakeHolderFormCol;
