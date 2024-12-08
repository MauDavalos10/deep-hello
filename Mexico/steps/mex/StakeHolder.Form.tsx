/* eslint-disable react-hooks/exhaustive-deps */
import CURP_REGEX from '@constants/curp';
import Button from '@efex-components/common/Button';
import ExpandMore from '@efex-components/common/ExpandMore';
import ModalDetail from '@efex-components/common/Modal/Modal';
import FileInputV3 from '@efex-components/EfexDS/FileInput/FileInput';
import { CountriesList, FederalEntitiesList } from '@efex-services/auth/types';
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
  Autocomplete,
  Box,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import IdRequirementsAlert from '@pages/onboarding/components/IdRequirementsAlert/IdRequirementsAlert';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CompanySectorAutocomplete from '@pages/onboarding/Mexico/steps/components/CompanySectorAutocomplete';
import {
  addressMaxLength,
  documentTypeOptions,
  eighteenYearsAgo,
  onlyNumbersRegex,
  onlyTextRegex,
} from '../../constants';
import GENDER_OPTIONS from '../../constants/genderOptions';
import type { MexicoStakeHoldersFormData } from '../../types/stakeholders.type';
import AddressMx from './AddressMx';

interface IStakeHolders {
  index: number;
  data?: MexicoStakeHoldersFormData;
  loading: boolean;
  countries: CountriesList[];
  birthcountries: CountriesList[];
  federalEntities: FederalEntitiesList[];
  uploadedFiles: IOnboardingDocuments[];
  stakeholderId?: number;
  remove: (index: number) => void;
  update: (index: number, data: MexicoStakeHoldersFormData) => void;
  getCountries: (value: string) => void;
  getBirthCountries: (value: string) => void;
  getFederalEntities: (value: string) => void;
  handleChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDropChangeFile: (files: FileList, name: string) => void;
  handleDeleteFile: (id: string | number) => void;
}

const StakeHolderFormMX = ({
  index,
  data,
  loading = false,
  countries,
  birthcountries,
  federalEntities,
  uploadedFiles,
  stakeholderId,
  remove,
  update,
  getCountries,
  getFederalEntities,
  handleChangeFile,
  handleDropChangeFile,
  handleDeleteFile,
  getBirthCountries,
}: IStakeHolders) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(!stakeholderId);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [fileTypeValidation, setFileTypeValidation] = useState<
    string | undefined
  >(undefined);
  const [controlNationalityCountry, setControlNationalityCountry] =
    useState<CountriesList | null>();

  const [canGoNext, { setFalse: cantGoNext, setTrue: goNext }] =
    useBoolean(false);
  const [businessSectorId, setBusinessSectorId] =
    useState<ICompanySector | null>();

  const [isResourceStatament, setIsResourceStatament] = useState<boolean>(
    data?.resourceFamilyStatament ?? false
  );
  const [isResourceFamilyStatament, setIsResourceFamilyStatament] =
    useState<boolean>(data?.resourceFamilyStatament ?? false);

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
  } = useForm<MexicoStakeHoldersFormData>({ mode: 'all' });

  const onSubmit = handleSubmit(async (values) => {
    update(id ?? index, { id, ...values });
    setIsLoading(true);
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const validateTypeFile = (value: string) => {
    setFileTypeValidation(value);
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
    if (data?.secondLastName) {
      setValue('secondLastName', data.secondLastName);
    }
    setValue(
      'birthDate',
      data?.birthDate || DateTime.fromJSDate(eighteenYearsAgo)
    );
    if (data?.citizenship) {
      getBirthCountries(data.citizenship);
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
    if (data?.idType) {
      setFileTypeValidation(data.idType);
      setValue('idType', data.idType);
    }
    if (data?.state) {
      setValue('state', data.state);
    }
    if (data?.gender) {
      setValue('gender', data.gender);
    }
    if (data?.countryBirthId) {
      getCountries(data.countryBirthId);
      setValue('nationalityPersonId', data.countryBirthId);
    }
    if (data?.federalEntityId) {
      getFederalEntities(data.federalEntityId);
      setValue('federalEntityId', data.federalEntityId);
    }
    if (data?.curp) {
      setValue('curp', data.curp);
    }
    setValue('resourceFamilyStatament', !!data?.resourceFamilyStatament);
    setValue(
      'legalRepresentativeStatament',
      !!data?.legalRepresentativeStatament
    );
    setValue(
      'resourceFamilyStatamentResponse',
      data?.resourceFamilyStatamentResponse
    );
    setValue('legalRepresentativeResponse', data?.legalRepresentativeResponse);
    if (data?.extNumber) {
      setValue('extNumber', data?.extNumber);
    }
    if (data?.intNumber) {
      setValue('intNumber', data?.intNumber);
    }
  }, [data]);

  useEffect(() => {
    if (businessSectorId) {
      setValue('businessSectorId', businessSectorId.id);
    }
  }, [businessSectorId, setValue]);

  useEffect(() => {
    if (data?.countryBirthId && countries) {
      if (countries[0].id === Number(data.countryBirthId)) {
        setControlNationalityCountry(countries[0]);
      }
    }
  }, [data, countries]);

  useEffect(() => {
    const filesAmount = fileTypeValidation === 'INE' ? 2 : 1;
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
              <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlName`)}
                    </Typography>
                    <TextField
                      autoComplete="off"
                      type="text"
                      className="custom-textfield "
                      placeholder={t(`onbStHlName`) as string}
                      helperText={t(`onbStHlNameMessage`) as string}
                      error={!!errors.name}
                      {...register('name', {
                        required: true,
                        pattern: {
                          value: onlyTextRegex,
                          message: '',
                        },
                      })}
                    />
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlLastName`)}
                    </Typography>
                    <TextField
                      autoComplete="off"
                      type="text"
                      className="custom-textfield "
                      placeholder={t(`onbStHlLastName`) as string}
                      helperText={t(`onbStHlNameMessage`) as string}
                      error={!!errors.lastName}
                      {...register('lastName', {
                        required: true,
                        pattern: {
                          value: onlyTextRegex,
                          message: '',
                        },
                      })}
                    />
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlSecondLastName`)}
                    </Typography>
                    <TextField
                      autoComplete="off"
                      type="text"
                      className="custom-textfield "
                      placeholder={t(`onbStHlSecondLastName`) as string}
                      helperText={t(`onbStHlNameMessage`) as string}
                      error={!!errors.lastName}
                      {...register('secondLastName', {
                        required: false,
                        pattern: {
                          value: onlyTextRegex,
                          message: '',
                        },
                      })}
                    />
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlBirthDate`)}
                    </Typography>
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
                            value={
                              field.value
                                ? DateTime.fromISO(field.value.toString())
                                : null
                            }
                            className={clsx('w-full ')}
                            onChange={(value) => {
                              if (!value) return;
                              field.onChange(value);
                            }}
                            slotProps={{
                              // eslint-disable-next-line react/no-unstable-nested-components
                              textField: (params) => (
                                <TextField
                                  {...params}
                                  error={!!errors.birthDate}
                                  fullWidth
                                />
                              ),
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
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
                      {t(`regBirthCountry`)}
                    </Typography>
                    <Controller
                      name="citizenship"
                      rules={{ required: true }}
                      control={control}
                      render={({ field: { onChange, ...props } }) => (
                        <Autocomplete
                          {...props}
                          disablePortal
                          getOptionLabel={(contact) => contact.name}
                          options={(birthcountries as CountriesList[]) ?? []}
                          value={
                            props.value
                              ? (birthcountries as CountriesList[])?.find(
                                  (country) =>
                                    country.id === Number(props.value)
                                )
                              : null
                          }
                          onChangeCapture={(e) =>
                            getBirthCountries(
                              (e as React.ChangeEvent<HTMLInputElement>).target
                                .value
                            )
                          }
                          onChange={(_, selectedOption) =>
                            onChange(selectedOption?.id)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              error={!!errors.citizenship}
                              autoComplete="off"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off',
                              }}
                            />
                          )}
                          renderOption={(innerProps, option) => (
                            <Box
                              component="li"
                              className="px-3"
                              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                              {...innerProps}
                            >
                              <div>{option.name}</div>
                            </Box>
                          )}
                        />
                      )}
                    />
                    {errors.citizenship && (
                      <p className="text-orange-600 text-xs">
                        {t('defaultError')}
                      </p>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlPercentage`)}
                    </Typography>
                    <TextField
                      autoComplete="off"
                      type="number"
                      className="custom-textfield "
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
                    <TextField
                      autoComplete="off"
                      type="text"
                      className="custom-textfield "
                      placeholder={t('onbStHlTitle') || ''}
                      error={!!errors.title}
                      {...register('title', {
                        required: true,
                        pattern: {
                          value: onlyTextRegex,
                          message: '',
                        },
                      })}
                    />
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t('regGender')}
                    </Typography>
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
                    <Controller
                      name="nationalityPersonId"
                      rules={{ required: true }}
                      control={control}
                      render={({ field: { onChange, ...props } }) => (
                        <Autocomplete
                          {...props}
                          disablePortal
                          getOptionLabel={(contact) => contact.name}
                          options={(countries as CountriesList[]) ?? []}
                          value={
                            props.value
                              ? (countries as CountriesList[])?.find(
                                  (country) =>
                                    country.id === Number(props.value)
                                )
                              : null
                          }
                          onChangeCapture={(e) =>
                            getCountries(
                              (e as React.ChangeEvent<HTMLInputElement>).target
                                .value
                            )
                          }
                          onChange={(_, selectedOption) => {
                            setControlNationalityCountry(selectedOption);
                            onChange(selectedOption?.id);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label={t('regNationality')}
                              error={!!errors.nationalityPersonId}
                              autoComplete="off"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off',
                              }}
                            />
                          )}
                          renderOption={(innerProps, option) => (
                            <Box
                              component="li"
                              className="px-3"
                              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                              {...innerProps}
                            >
                              <div>{option.name}</div>
                            </Box>
                          )}
                        />
                      )}
                    />
                    {errors.nationalityPersonId && (
                      <p className="text-orange-600 text-xs">
                        {t('defaultError')}
                      </p>
                    )}
                  </FormControl>
                </Grid>
                {controlNationalityCountry?.countryKey === 'MX' ? (
                  <>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Controller
                          name="federalEntityId"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, ...props } }) => (
                            <Autocomplete
                              {...props}
                              disablePortal
                              getOptionLabel={(contact) => contact.description}
                              options={
                                (federalEntities as FederalEntitiesList[]) ?? []
                              }
                              value={
                                props.value
                                  ? (
                                      federalEntities as FederalEntitiesList[]
                                    )?.find(
                                      (country) =>
                                        country.id === Number(props.value)
                                    )
                                  : null
                              }
                              onChangeCapture={(e) =>
                                getFederalEntities(
                                  (e as React.ChangeEvent<HTMLInputElement>)
                                    .target.value
                                )
                              }
                              onChange={(_, selectedOption) =>
                                onChange(selectedOption?.id)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  label={t('regFederalEntity')}
                                  error={!!errors.nationalityPersonId}
                                  autoComplete="off"
                                  inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'off',
                                  }}
                                />
                              )}
                              renderOption={(innerProps, option) => (
                                <Box
                                  component="li"
                                  className="px-3"
                                  sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                  {...innerProps}
                                >
                                  <div>{option.description}</div>
                                </Box>
                              )}
                            />
                          )}
                        />
                        {errors.federalEntityId && (
                          <p className="text-orange-600 text-xs">
                            {t('defaultError')}
                          </p>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <TextField
                          id="curp"
                          label={t('regCurp')}
                          helperText={t(`regCurpHelper`) as string}
                          error={!!errors.curp}
                          {...register('curp', {
                            required: true,
                            pattern: CURP_REGEX,
                          })}
                          onChange={(event) => {
                            event.target.value =
                              event.target.value.toUpperCase();
                          }}
                        />
                        {errors.curp && errors.curp.type === 'required' && (
                          <p className="text-orange-600 text-xs">
                            {t('defaultError')}
                          </p>
                        )}
                        {errors.curp && errors.curp.type === 'pattern' && (
                          <p className="text-orange-600 text-xs">
                            {t('regCurpValidation')}
                          </p>
                        )}
                      </FormControl>
                    </Grid>
                  </>
                ) : null}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t('regMxSector')}
                    </Typography>
                    <CompanySectorAutocomplete
                      className="w-full"
                      data={data}
                      selectedValue={businessSectorId}
                      showCompanySectorError={false}
                      onSelectCompanySector={setBusinessSectorId}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} className="mx-5" />
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Controller
                          name="legalRepresentativeStatament"
                          control={control}
                          render={({ field: { value, ref, ...field } }) => (
                            <Checkbox
                              {...field}
                              onChange={(event, checked) => {
                                setIsResourceStatament(checked);
                                field.onChange(event);
                              }}
                              inputRef={ref}
                              checked={!!value}
                              disableRipple
                            />
                          )}
                        />
                      }
                      label={t('regResourceStatement')}
                    />
                  </FormControl>
                </Grid>
                {isResourceStatament ? (
                  <Grid item xs={12} className="!mb-3">
                    <FormControl fullWidth>
                      <Typography variant="subtitle2">
                        {t('regResourceStatementResponse')}
                      </Typography>
                      <TextField
                        autoComplete="off"
                        type="text"
                        error={!!errors.legalRepresentativeResponse}
                        className="custom-textfield"
                        size="small"
                        placeholder={
                          t('regResourceStatementResponse') as string
                        }
                        {...register('legalRepresentativeResponse', {
                          required: true,
                        })}
                      />
                      {errors && errors.legalRepresentativeResponse && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Controller
                          name="resourceFamilyStatament"
                          control={control}
                          render={({ field: { value, ref, ...field } }) => (
                            <Checkbox
                              {...field}
                              onChange={(event, checked) => {
                                setIsResourceFamilyStatament(checked);
                                field.onChange(event);
                              }}
                              inputRef={ref}
                              checked={!!value}
                              disableRipple
                            />
                          )}
                        />
                      }
                      label={t('regResourceStatementFamily')}
                    />{' '}
                  </FormControl>
                </Grid>
                {isResourceFamilyStatament ? (
                  <Grid item xs={12} className="!mb-3">
                    <FormControl fullWidth>
                      <Typography variant="subtitle2">
                        {t('regResourceStatementFamilyResponse')}
                      </Typography>
                      <TextField
                        autoComplete="off"
                        type="text"
                        error={!!errors.resourceFamilyStatamentResponse}
                        className="custom-textfield"
                        size="small"
                        placeholder={
                          t('regResourceStatementFamilyResponse') as string
                        }
                        {...register('resourceFamilyStatamentResponse', {
                          required: true,
                        })}
                      />
                      {errors && errors.resourceFamilyStatamentResponse && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    </FormControl>
                  </Grid>
                ) : null}

                <Grid xs={12} className="!mt-8">
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
                    <Controller
                      name="idType"
                      rules={{ required: true }}
                      control={control}
                      render={({ field }) => (
                        <Select
                          fullWidth
                          labelId="idType"
                          className="custom-textfield !w-[85%]"
                          error={!!errors.idType}
                          value={
                            field.value
                              ? documentTypeOptions.find(
                                  (option) => option.value === field.value
                                )?.value
                              : ''
                          }
                          onChange={(event) => {
                            const { value } = event.target;
                            field.onChange(value);
                            validateTypeFile(value);
                          }}
                        >
                          {documentTypeOptions.map((idType) => (
                            <MenuItem key={idType.value} value={idType.value}>
                              {t(idType.value)}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
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
                    <TextField
                      autoComplete="off"
                      type="text"
                      className="custom-textfield "
                      placeholder={t('onbStHlIdNumber') || ''}
                      error={!!errors.idNumber}
                      {...register('idNumber', { required: true })}
                    />
                    {errors && errors.idNumber && (
                      <p className="text-orange-600 text-xs mt-1">
                        {t('defaultError')}
                      </p>
                    )}
                  </FormControl>
                </Grid>
                {fileTypeValidation === documentTypeOptions[1].value ? (
                  <Grid item xs={12} md={6}>
                    <FileInputV3
                      inputName="passport"
                      onChange={handleChangeFile}
                      onDropChange={handleDropChangeFile}
                      onDelete={handleDeleteFile}
                      title={t('onbStHlIdFileFront') || ''}
                      documents={
                        data?.documents?.filter(
                          (element) =>
                            element.document.type.id ===
                            OnboardingUsaDocumentTypeIds.passport
                        ) ??
                        uploadedFiles.filter(
                          (element) =>
                            element.document.type.id ===
                            OnboardingUsaDocumentTypeIds.passport
                        )
                      }
                    />
                  </Grid>
                ) : null}
                {fileTypeValidation === documentTypeOptions[0].value ? (
                  <>
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
                  </>
                ) : null}

                <Grid item xs={12} />

                <AddressMx
                  errors={errors}
                  control={control}
                  register={register}
                  setValue={setValue}
                  data={data}
                />

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2">
                      {t(`onbStHlResidence`)}
                    </Typography>
                    <TextField
                      autoComplete="off"
                      type="text"
                      className="custom-textfield w-full max-w-[920px]"
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
                    {errors && errors.addressLine1 && (
                      <p className="text-orange-600 text-xs mt-1">
                        {t('defaultError')}
                      </p>
                    )}
                  </FormControl>
                </Grid>

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
                        error={!!errors?.extNumber}
                        placeholder="3A"
                        {...register('extNumber', {
                          required: true,
                          maxLength: addressMaxLength,
                        })}
                      />
                    </div>
                    {errors?.extNumber &&
                      errors?.extNumber.type === 'required' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    {errors?.extNumber &&
                      errors?.extNumber.type === 'maxLength' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('MaxLengthCharacters', {
                            max: addressMaxLength,
                          })}
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
                        error={!!errors?.intNumber}
                        placeholder="Depto 1"
                        {...register('intNumber', {
                          maxLength: addressMaxLength,
                        })}
                      />
                    </div>
                    {errors?.intNumber &&
                      errors?.intNumber.type === 'required' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('defaultError')}
                        </p>
                      )}
                    {errors?.intNumber &&
                      errors?.intNumber.type === 'maxLength' && (
                        <p className="text-orange-600 text-xs mt-1">
                          {t('MaxLengthCharacters', {
                            max: addressMaxLength,
                          })}
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
              <CardActions className="flex justify-around gap-10">
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
                  disabled={(!id && !canGoNext) || loading}
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

export default StakeHolderFormMX;
